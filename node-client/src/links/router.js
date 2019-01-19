import express from "express";
import {controller} from "./controller";
import Path from "../path";
import routerUtils from "../RouterUtils";

const router = express.Router({mergeParams: true});

router.route("/").get((req, res) => {
    controller.loadLinksObservable(req.params[Path.getContractVar()])
    .subscribe(data => res.json(data));
});

router.route(Path.create().addVar("link").getPath()).post((req, res) => {
    let contract = req.params[Path.getContractVar()];
    let link = req.params.link;
    let tag = req.body.tag;

    if(controller.isDeploying({contract, link, tag})) {
        res.json("Already linking!");
        return
    }

    controller.addLink(contract, link, tag);

    res.json("Linking...");
});

router.route(Path.create().addVar("link").addVar("tag").getPath()).get((req, res) => {
    let contract = req.params[Path.getContractVar()];
    let link = req.params.link;
    let tag = req.params.tag;

    routerUtils.checkCachedAndSend(res, controller, {contract, link, tag});
});

export default router;