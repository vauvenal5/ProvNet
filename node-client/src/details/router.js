import express from "express";
import controller from "./controller";
import Path from "../path";
import routerUtils from "../RouterUtils";

const router = express.Router({mergeParams: true});

router.route("/").get((req, res) => {
    controller.loadContractDetails(req.params[Path.getContractVar()])
    .subscribe(data => res.json(data));
});

router.route("/title").get((req, res) => {
    controller.getTitle(req.params[Path.getContractVar()], title => {
        res.json(title);
    });
});

router.route("/title").post((req, res) => {
    let title = req.body.title;
    
    if(title === undefined) {
        res.status(500);
        res.json({msg: "Title required!"});
        return;
    }

    if(controller.isDeploying(title)) {
        res.json("Already setting title...");
        return;
    }

    controller.setTitle(req.params[Path.getContractVar()], title);

    res.json("Setting title...");
});

router.route(Path.create().addVar("title").getPath()).get((req, res) => {
    routerUtils.checkCachedAndSend(res, controller, {title: req.params.title});
});

export default router;