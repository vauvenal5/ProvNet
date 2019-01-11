#!/usr/bin/env node
require("@babel/register");
var Deployer = require("./deployer").default;
var UserControl = require("./userControl").default;
var Linker = require("./linker").default;
var CostCounter = require("./CostCounter").default;
var program = require("commander");
const Rx = require("rxjs");
const rp = require("request-promise");

program
    .version("1.0.0")
    .option("-s, --scenario <scenario> ", "Run scenario.")
    .option("-c, --contract <contract> ", "Contract address.", "0x2ab5dfedb4096fb91706c40d0397fb10f979fc6d")
    .option("-t, --target <target> ", "Target URI.", "https://find.this.com/resource1")
    //.option("-d, --deploy <network>", "Deploys evaluation network.")
    //.option("-r, --reset <network>", "Resets the specified network.")
    //.option("-p, --persist", "Only with -d or -r: Persists changes to config.", false)
    .option("-oc, --only-contracts", "Only with -d: Will deploy only the contracts and stop.", false);

program.command("reset <network>").description("Resets the specified network.")
.action((network, options) => {
    let deployer = new Deployer(network, true);
    deployer.resetNetwork();
    deployer.persist();
});

program.command("deploy <network>").description("Deploys evaluation network.")
.option("-o, --only", "Deploy only contracts.", false)
.option("-p, --persist", "Persists changes to config.", false)
.action((network, options) => {
    let costCounter = new CostCounter();
    let deployer = new Deployer(network, options.persist, costCounter);
    let userControl = new UserControl();
    let linker = new Linker();

    deployer.deployDefault().subscribe(network => {
        if(options.only) {
            costCounter.contractSubject.complete();
            return;
        }

        let links = [];
        links.push(userControl.roleIndex.links.trusted);
        links.push(userControl.roleIndex.links.known);
        let specials = [];
        specials.push(userControl.roleIndex.specials.editor);

        userControl.checkRights(deployer.getAddressArray(), "0xEF69E5db32337CEC2e78467c1821F7Bb973c228A", links, specials).subscribe(
            user => {
                let roleAdded = user.events.RoleAdded;
                if(roleAdded === undefined) {
                    console.log(user);
                } else {
                    let out = {
                        event: roleAdded.event,
                        contract: roleAdded.address,
                        user: roleAdded.returnValues.operator,
                        role: roleAdded.returnValues.role,
                        cost: user.gasUsed
                    }
                    console.log(out);
                    costCounter.userSubject.next(out);
                }
            },
            err => console.log(err),
            () => {
                network.tu.children.push(network.infosys);
                network.infosys.children.push(network.dsg);
                linker.linkNetwork(network.tu, 1).subscribe(
                    link => {
                        let linkAdded = link.events.LinkAdded;
                        if(linkAdded === undefined) {
                            console.log(link);
                        }
                        linkAdded.map(event => {
                            let out = {
                                event: event.event,
                                from: event.address,
                                to: event.returnValues.to,
                                tag: event.returnValues.tag,
                                cost: link.gasUsed
                            }
                            console.log(out);
                        });
                    },
                    err => console.log(err),
                    () => {
                        console.log("All deployed!");
                        costCounter.contractSubject.complete();
                        costCounter.userSubject.complete();
                    }
                );
            }
        );
    });
});

program.parse(process.argv);

// if(program.reset) {
//     let deployer = new Deployer(program.reset, program.persist);
//     deployer.resetNetwork();
//     deployer.persist();
// }

// if(program.deploy) {
//     let deployer = new Deployer(program.deploy, program.persist);
//     let userControl = new UserControl();
//     let linker = new Linker();

//     deployer.deployDefault().subscribe(network => {
//         let links = [];
//         links.push(userControl.roleIndex.links.trusted);
//         links.push(userControl.roleIndex.links.known);
//         let specials = [];
//         specials.push(userControl.roleIndex.specials.editor);

//         userControl.checkRights(deployer.getAddressArray(), "0xEF69E5db32337CEC2e78467c1821F7Bb973c228A", links, specials).subscribe(
//             user => {
//                 let roleAdded = user.events.RoleAdded;
//                 if(roleAdded === undefined) {
//                     console.log(user);
//                 } else {
//                     let out = {
//                         event: roleAdded.event,
//                         contract: roleAdded.address,
//                         user: roleAdded.returnValues.operator,
//                         role: roleAdded.returnValues.role,
//                     }
//                     console.log(out);
//                 }
//             },
//             err => console.log(err),
//             () => {
//                 network.tu.children.push(network.infosys);
//                 network.infosys.children.push(network.dsg);
//                 linker.linkNetwork(network.tu, 1).subscribe(
//                     link => {
//                         let linkAdded = link.events.LinkAdded;
//                         if(linkAdded === undefined) {
//                             console.log(link);
//                         }
//                         linkAdded.map(event => {
//                             let out = {
//                                 event: event.event,
//                                 from: event.address,
//                                 to: event.returnValues.to,
//                                 tag: event.returnValues.tag,
//                             }
//                             console.log(out);
//                         });
//                     },
//                     err => console.log(err),
//                     () => {
//                         console.log("All deployed!");
//                     }
//                 );
//             }
//         );
//     });
// }

if(program.scenario === "search") {
    let target = encodeURIComponent(program.target);
    let links = encodeURIComponent(JSON.stringify(["trusted"]));

    let requestObs = Rx.from(rp("http://localhost:3001/contracts/"+program.contract+"/search?target="+target+"&links="+links));
    requestObs.subscribe((res) => {
        console.log(JSON.parse(res));
    });
}