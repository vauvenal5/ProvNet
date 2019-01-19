require("@babel/register");
require('dotenv').load();
var program = require("commander");

program
    .version("1.0.0")
    .option("-n, --network <network> ", "Specify the desired network. Network config overrules url input.", "ui")
    .option("-p, --port <port> ", "Specify a custom port.", 3001)
    .option("-u, --url <url> ", "Target URL.", "http://127.0.0.1:8545/");
program.parse(process.argv);

var port = program.port;
process.env.URL = program.url;
process.env.network = program.network;

var app = require("./app").app;
app.listen(port, function () {
    // console.log("Node client using network", process.env.network);
    // console.log('Node client listening on port', port);
    // console.log("Node client will communicate with", process.env.URL);
});