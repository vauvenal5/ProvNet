import express from "express";
import controller from "./controller";
import Path from "../path";
import routerUtils from "../RouterUtils";
const uuidv1 = require("uuid/v1");

const router = express.Router({mergeParams: true});

router.route("/").get((req, res) => {
    let searched = {};
    let results = {};
    let links = JSON.parse(req.query.links);
    let start = Date.now();
    controller.bfs(searched, req.params[Path.getContractVar()].toLowerCase(), req.query.target, links).subscribe(value => {
        console.log("BFS found: "+value);
        results[value] = searched[value];
    }, err => console.log(err), () => res.json({
        results: {
            count: Object.keys(results).length,
            time: Date.now()-start,
            list: results
        },
        searched: {
            count: Object.keys(searched).length,
            list: searched
        }
    }));
});

router.route("/").post((req, res) => {
    let links = req.body.links;
    let address = req.params[Path.getContractVar()].toLowerCase();
    let url = req.body.target;
    let uuid = uuidv1();
    controller.runBfs(uuid, address, url, links);
    res.json({uuid});
});

router.route(Path.create().addVar("uuid").getPath()).get((req, res) => {
    routerUtils.checkCachedAndSend(res, controller, {uuid: req.params.uuid});
});

export default router;