import express from "express";
import {controller} from "./controller";
import links from "../links";
import details from "../details";
import types from "../types";
import Path from "../path";
import search from "../search";
import users from "../users";
import * as Rx from "rxjs";
import web3Provider from "../web3Provider";

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

router.route(Path.create().addDeploy().getPath()).put((req, res) => {
    if(req.body.title === undefined) {
        res.status(500);
        res.json({msg: "Title required!"});
        return;
    }

    console.log("Requesting deployment for: " +  req.body.title);

    controller.deployContract(req.body.title, contract => {
        if(contract.error) {
            res.status(500);
        }
        res.json(contract);
    });
});

router.route(Path.create().addContractVar().getPath()).put((req, res) => {
    console.log(req.body);
    let prov = req.body.prov;
    if(typeof prov !== String) {
        prov = JSON.stringify(prov);
    }
    controller.pushProvenance(req.params[Path.getContractVar()], req.body.url, prov)
    .subscribe(data => {
        if(data.error) {
            res.status(500);
        }
        res.json(data);
    });
});

export default router;