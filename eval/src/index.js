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
    deployer.resetNetwork();
    deployer.persist();
    userControl.resetNetwork();
    userControl.persist();
    linker.resetNetwork();
    linker.persist();
});

program.command("deploy <network>").description("Deploys evaluation network.")
.option("-o, --only", "Deploy only contracts.", false)
.option("-p, --persist", "Persists changes to config.", false)
.option("-k, --keyPath [path]", "Path to node client key file.", "../node-client/.keys/account.json")
.action((network, options) => {
    let deployer = new Deployer(network, options.persist);
    let userControl = new UserControl(network, options.persist);
    let linker = new Linker(network, options.persist);
    
    let account = JSON.parse(fs.readFileSync(options.keyPath));

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
                network.tu.children.push(network.infosys);
                network.infosys.children.push(network.dsg);
                
                linker.linkNetwork(network.tu, 1).subscribe(
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

program.command("provcost").description("Evaluate the cost to store provenance data.")
.option("-s, --size <size>", "Byte size to use.", 100)
.action((options) => {
    const rl = readline.createInterface({
        input: fs.createReadStream('./config/ProvNet.git2prov.n'),
        crlfDelay: Infinity
    });

    //console.log(options.parent.contract);

    let provWriter = new ProvWriter();
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

        if(bytes == size){
            console.log("LineNr: "+lineNr+" Bytecount: " + bytes);
            found = true;
            rl.close();
            provWriter.measureProv(options.parent.contract, line).subscribe(res => {
                let out = {
                    size: size,
                    times: res.times,
                    cost: res.receipt.gasUsed
                };
                console.log(out);
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