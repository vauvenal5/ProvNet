#!/usr/bin/env node

var program = require("commander");
const Rx = require("rxjs");
const rp = require("request-promise");

program
    .version("1.0.0")
    .option("-s, --scenario <scenario> ", "Run scenario.")
    .option("-c, --contract <contract> ", "Contract address.", "0xdc3044110b5aa207b5f30adce7b4398851fa0f8f")
    .option("-t, --target <target> ", "Target URI.", "https://find.this.com/resource1")
    .parse(process.argv);

console.log(program.scenario);

let target = encodeURIComponent(program.target);

let requestObs = Rx.from(rp("http://localhost:3001/contracts/"+program.contract+"/search?target="+target));
requestObs.subscribe((res) => {
    console.log(JSON.parse(res));
});