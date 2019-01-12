import express from "express";
import bodyParser from "body-parser";
import contracts from "./contracts";

export const app = express();

app.use(bodyParser.json({limit: '50mb'}));

app.use("/contracts", contracts.router);

app.get('/', function (req, res) {
  res.json({text: 'Hello from the ProvNet worker!'});
});

