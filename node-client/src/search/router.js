import express from "express";
import {controller} from "./controller";
import Path from "../path";

const router = express.Router({mergeParams: true});

router.route("/").get((req, res) => {
    let searched = [];
    let results = [];
    controller.bfs(searched, req.params[Path.getContractVar()].toLowerCase(), "https://find.this.com/resource1").subscribe(value => {
        console.log(value);
        results.push(value);
    }, err => console.log(err), () => res.json({searched, results}));
});

export default router;