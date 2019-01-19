import express from "express";
import controller from "./controller";
import links from "../links";
import details from "../details";
import types from "../types";
import Path from "../path";
import search from "../search";
import users from "../users";
import * as Rx from "rxjs";
import web3Provider from "../web3Provider";
import routerUtils from "../RouterUtils";

const uuidv1 = require("uuid/v1");
const uuidv4 = require("uuid/v4");
const router = express.Router();

router.use(Path.create().addContractVar().addDetails().getPath(), details.router);
router.use(Path.create().addContractVar().addTypes().getPath(), types.router);
router.use(Path.create().addContractVar().addLinks().getPath(), links.router);
router.use(Path.create().addContractVar().addSearch().getPath(), search.router);
router.use(Path.create().addContractVar().addUsers().getPath(), users.router);

router.route(Path.create().addContractVar().getPath()).get((req, res) => {
    controller.loadContractObservable(req.params[Path.getContractVar()])
    .subscribe(data => res.json(data));
});

router.route(Path.create().addDeploy().getPath()).post((req, res) => {
    let title = req.body.title;
    
    if(title === undefined) {
        res.status(500);
        res.json({msg: "Title required!"});
        return;
    }

    console.log("Requesting deployment for: " +  req.body.title);

    if(controller.isDeploying(title)) {
        console.log("Already deploying: " +  req.body.title);
        res.json("Already deploying "+ req.body.title);
        return;
    }

    controller.deployContract(req.body.title);

    res.json("Deploying "+ req.body.title);
});

router.route(Path.create().addDeploy().addVar("title").getPath()).get((req, res) => {
    if(req.params.title === undefined) {
        res.status(500);
        res.json({msg: "Title required!"});
        return;
    }

    routerUtils.checkCachedAndSend(res, controller, req.params.title);
});

router.route(Path.create().addContractVar().getPath()).post((req, res) => {
    let prov = req.body.prov;
    if(typeof prov !== String) {
        prov = JSON.stringify(prov);
    }

    let uuid = uuidv1();

    controller.pushProvenance(req.params[Path.getContractVar()], req.body.url, prov, uuid);

    res.json({uuid});
});

router.route(Path.create().addContractVar().addVar("uuid").getPath()).get((req, res) => {
    routerUtils.checkCachedAndSend(res, controller, {uuid: req.params.uuid});
});

export default router;