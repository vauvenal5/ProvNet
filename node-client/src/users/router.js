import express from "express";
import {controller} from "./controller";
import links from "../links";
import details from "../details";
import types from "../types";
import Path from "../path";
import search from "../search";
import * as Rx from "rxjs";
import web3Provider from "../web3Provider";

const router = express.Router({mergeParams: true});

router.route(Path.create().addVar("user").getPath()).get((req, res) => {
    let contract = req.params[Path.getContractVar()];
    let user = req.params["user"];

    controller.getUser(contract, user, (user) => {
        res.json(user);
    });
});

router.route(Path.create().addVar("user").getPath()).post((req, res) => {
    let contract = req.params[Path.getContractVar()];
    let user = req.params["user"];
    let tag = req.body.tag;

    if(controller.isDeploying({contract, user, tag})) {
        res.json("Already adding user.");
        return;
    }
    
    controller.addUser(contract, user, tag);

    res.json("Adding user...");
});

router.route(Path.create().addVar("user").addVar("tag").getPath()).get((req, res) => {
    let contract = req.params[Path.getContractVar()];
    let user = req.params["user"];
    let tag = req.params.tag;

    let data = controller.checkDeploymentState({contract, user, tag});
    
    if(data === undefined || data.error) {
        res.status(500);
    }
    res.json(data);
});


export default router;