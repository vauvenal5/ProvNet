import express from "express";
import {controller} from "./controller";
import Path from "../path";

const router = express.Router({mergeParams: true});

router.route("/").get((req, res) => {
    controller.loadContractDetails(req.params[Path.getContractVar()])
    .subscribe(data => res.json(data));
});

export default router;