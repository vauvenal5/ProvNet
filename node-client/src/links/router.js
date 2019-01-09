import express from "express";
import {controller} from "./controller";
import Path from "../path";

const router = express.Router({mergeParams: true});

router.route("/").get((req, res) => {
    controller.loadLinksObservable(req.params[Path.getContractVar()])
    .subscribe(data => res.json(data));
});

router.route(Path.create().addVar("link").getPath()).put((req, res) => {
    let contract = req.params[Path.getContractVar()];
    let link = req.params.link;
    let tag = req.body.tag;

    controller.addLink(contract, link, tag, (data) => {
        if(data.error) {
            res.status(500);
        }

        res.json(data);
    })
});

export default router;