import express from "express";
import {controller} from "./controller";
import Path from "../path";

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

export default router;