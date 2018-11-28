require("@babel/register");
require('dotenv').load();
var port = process.env.PORT || 3001;
process.env.URL = process.env.URL || 'http://127.0.0.1:8545/';
var app = require("./app").app;
app.listen(port, function () {
    console.log('Node client listening on port', port);
    console.log("Node client will communicate with", process.env.URL);
});