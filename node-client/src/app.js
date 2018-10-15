import express from "express";
import contracts from "./contracts";

export const app = express();

app.use("/contracts", contracts.router);

app.get('/', function (req, res) {
  res.json({text: 'Hello from the ProvNet worker!'});
});

