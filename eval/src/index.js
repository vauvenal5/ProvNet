#!/usr/bin/env node
require("@babel/register");
var Deployer = require("./deployer").default;
var UserControl = require("./userControl").default;
var Linker = require("./linker").default;
var program = require("commander");
const Rx = require("rxjs");
const rp = require("request-promise");

program
    .version("1.0.0")
    .option("-s, --scenario <scenario> ", "Run scenario.")
    .option("-c, --contract <contract> ", "Contract address.", "0xdc3044110b5aa207b5f30adce7b4398851fa0f8f")
    .option("-t, --target <target> ", "Target URI.", "https://find.this.com/resource1")
    .option("-d, --deploy <network>", "Deploys evaluation network.")
    .option("-r, --reset <network>", "Resets the specified network.")
    .option("-p, --persist", "Only with -d or -r: Persists changes to config.", false)
    .parse(process.argv);

if(program.reset) {
    let deployer = new Deployer(program.reset, program.persist);
    deployer.resetNetwork();
    deployer.persist();
}

if(program.deploy) {
    let deployer = new Deployer(program.deploy, program.persist);
    let userControl = new UserControl();
    let linker = new Linker();

    deployer.deployDefault().subscribe(network => {
        let links = [];
        links.push(userControl.roleIndex.links.trusted);
        links.push(userControl.roleIndex.links.known);
        let specials = [];
        specials.push(userControl.roleIndex.specials.editor);

        userControl.checkRights(deployer.getAddressArray(), "0xd8Bb0056E6945e7d19CF254f0a1Fa32bcEF041Ee", links, specials).subscribe(
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
                    }
                    console.log(out);
                }
            },
            err => console.log(err),
            () => {
                network.tu.children.push(network.infosys);
                network.infosys.children.push(network.dsg);
                linker.linkNetwork(network.tu, 1).subscribe(
                    link => {},
                    err => console.log(err),
                    () => console.log("All deployed!")
                );
            }
        );
    });
}

let target = encodeURIComponent(program.target);

// let requestObs = Rx.from(rp("http://localhost:3001/contracts/"+program.contract+"/search?target="+target));
// requestObs.subscribe((res) => {
//     console.log(JSON.parse(res));
// });