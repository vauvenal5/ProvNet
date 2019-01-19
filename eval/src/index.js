#!/usr/bin/env node
require("@babel/register");
var Deployer = require("./deployer").default;
var UserControl = require("./userControl").default;
var Linker = require("./linker").default;
var CostCounter = require("./CostCounter").default;
var ProvWriter = require("./ProvWriter").default;
var program = require("commander");
const Rx = require("rxjs");
const rp = require("request-promise");
var fs = require("fs");
const readline = require('readline');

program
    .version("1.0.0")
    //.option("-s, --scenario <scenario> ", "Run scenario.")
    .option("-c, --contract <contract> ", "Contract address.", "0xdcabb02d80e27f809910a01ca8d2f98230e158a9")
    .option("-t, --target <target> ", "Target URI.", "https://find.this.com/resource1");
    //.option("-d, --deploy <network>", "Deploys evaluation network.")
    //.option("-r, --reset <network>", "Resets the specified network.")
    //.option("-p, --persist", "Only with -d or -r: Persists changes to config.", false)
    //.option("-oc, --onlyContracts", "Only with -d: Will deploy only the contracts and stop.", false);

program.command("reset <network>").description("Resets the specified network.")
.action((network, options) => {
    let deployer = new Deployer(network, true);
    let userControl = new UserControl(network, true);
    let linker = new Linker(network, true);
    let provWriter = new ProvWriter("", 0, network, true);
    deployer.resetNetwork();
    deployer.persist();
    userControl.resetNetwork();
    userControl.persist();
    linker.resetNetwork();
    linker.persist();
    provWriter.resetNetwork();
    provWriter.persist();
});

program.command("deploy <network>").description("Deploys evaluation network.")
.option("-o, --only", "Deploy only contracts.", false)
.option("-s, --skipSearch", "Deploy only shallow search contracts.", false)
.option("-p, --persist", "Persists changes to config.", false)
.option("-k, --keyPath [path]", "Path to node client key file.", "../node-client/.keys")
.action((network, options) => {
    let deployer = new Deployer(network, options.persist, options.skipSearch);
    let userControl = new UserControl(network, options.persist);
    let linker = new Linker(network, options.persist);
    
    let path = options.keyPath + "/config." + network + ".json"; 
    let account = JSON.parse(fs.readFileSync(path)).account;

    deployer.deployDefault().subscribe(network => {        
        if(options.only) {
            deployer.costCounter.complete();
            return;
        }

        let links = [];
        links.push(userControl.roleIndex.links.trusted);
        links.push(userControl.roleIndex.links.known);
        let specials = [];
        specials.push(userControl.roleIndex.specials.editor);

        userControl.checkRights(deployer.getAddressArray(), account.address, links, specials).subscribe(
            user => {
                let roleAdded = user.receipt.events.RoleAdded;
                if(roleAdded === undefined) {
                    console.log(user);
                } else {
                    userControl.addEvent(roleAdded, user.receipt.gasUsed, user.contract);
                }
            },
            err => console.log(err),
            () => {                
                linker.linkNetwork(network.searches.search256, 1).subscribe(
                    link => {
                        let linkAdded = link.receipt.events.LinkAdded;
                        if(linkAdded === undefined) {
                            console.log(link);
                        }
                        linkAdded.filter(event => event.returnValues.tag != 4).map(event => {
                            linker.addEvent(event, link.receipt.gasUsed, link.from, link.to);
                        });
                    },
                    err => console.log(err),
                    () => {
                        deployer.costCounter.complete();
                        userControl.costCounter.complete();
                        linker.costCounter.complete();
                        console.log("All deployed!");
                    }
                );
            }
        );
    });
});

program.command("provcost <network>").description("Evaluate the cost to store provenance data.")
.option("-s, --size <size>", "Byte size to use.", 128)
.option("-u, --urlPart <urlPart>", "UrlPart will be appended to prov url.", "eval001")
.option("-p, --persist", "Persists changes to config.", false)
.action((network, options) => {
    const rl = readline.createInterface({
        input: fs.createReadStream('./config/ProvNet.git2prov.n'),
        crlfDelay: Infinity
    });

    //console.log(options.parent.contract);

    let provWriter = new ProvWriter(options.urlPart, parseInt(options.size), network, options.persist);
    let lineNr = 1;
    let found = false;

    //entity(result:file-eth-test-SwitchableRBACWithSuperuser-test-js_commit-229761e586590a3bb6b646928941bdac6b1360ab)    
    rl.on('line', (line) => {
        if(found) {
            return;
        }

        lineNr++;
        let bytes = Buffer.byteLength(line, 'utf8');
        let size = parseInt(options.size);

        let latexOut = "";
        let printRes = (res) => {
            // let out = {
            //     size: size,
            //     times: res.times,
            //     cost: res.gasUsed
            // };
            console.log(res);
            //latexOut = latexOut + "("+parseInt(out.size)*parseInt(out.times)+","+out.cost+")\n";
            latexOut = latexOut + "("+res.size+","+res.cost+")\n";
        };

        if(bytes == size){
            console.log("LineNr: "+lineNr+" Bytecount: " + bytes);
            found = true;
            rl.close();

            console.log("Initial transaction:");
            provWriter.saveProv(options.parent.contract, line, 127).subscribe(receipt => {
                printRes(receipt);
                latexOut = "";
                console.log("Big transactions:")
                provWriter.measureProv(options.parent.contract, line).subscribe(
                    res => printRes(res), 
                    err => console.log(err), 
                    () => {
                        console.log(latexOut);
                        latexOut = "";
                        console.log("Many transactions:")
                        provWriter.measureProvIot(options.parent.contract, line).subscribe(
                            res => printRes(res),
                            err => console.log(err),
                            () => {
                                console.log(latexOut);
                                provWriter.costCounter.complete();
                            }
                        )
                    }
                );
            });
        }
    });
});

program.parse(process.argv);

if(program.scenario === "search") {
    let target = encodeURIComponent(program.target);
    let links = encodeURIComponent(JSON.stringify(["trusted"]));

    let requestObs = Rx.from(rp("http://localhost:3001/contracts/"+program.contract+"/search?target="+target+"&links="+links));
    requestObs.subscribe((res) => {
        console.log(JSON.parse(res));
    });
}