import express from "express";
import Web3 from "web3";

export const app = express();

app.get('/', function (req, res) {
  res.json({text: 'Hello World2!'});
});