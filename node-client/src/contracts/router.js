import express from "express";
import {controller} from "./controller";
import links from "../links";
import details from "../details";
import types from "../types";
import Path from "../path";

const router = express.Router();

router.use(
    Path.create().addContractVar().addDetails().getPath(), details.router
);

router.use(
    Path.create().addContractVar().addTypes().getPath(), types.router
);

router.use(
    Path.create().addContractVar().addLinks().getPath(), links.router
);

router.route(Path.create().addContractVar().getPath()).get((req, res) => {
    controller.loadContractObservable(req.params[Path.getContractVar()])
    .subscribe(data => res.json(data));
});

router.route(Path.create().addContractVar().getPath()).put((req, res) => {
    console.log(req.params);
    controller.pushProvenance(req.params[Path.getContractVar()])
    .subscribe(data => res.json(data));
})

export default router;