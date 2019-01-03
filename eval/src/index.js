#!/usr/bin/env node

var program = require("commander");
const Rx = require("rxjs");
const rp = require("request-promise");

program
    .version("1.0.0")
    .option("-s, --scenario [id]", "Run scenario.")
    .parse(process.argv);

console.log(program.scenario);

let req = {
    host: "http://localhost",
    port: 3001,
    path: "/contracts/0xccb9b0e85393b35bf1a325aeceda0a835679fb5d/search",
    method: "GET"
};

let requestObs = Rx.from(rp("http://localhost:3001/contracts/0xccb9b0e85393b35bf1a325aeceda0a835679fb5d/search"));
requestObs.subscribe((res) => {
    console.log(JSON.parse(res));
});