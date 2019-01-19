class RouterUtils{
    checkCachedAndSend(res, controller, id) {
        let data = controller.checkDeploymentState(id);
        
        if(data === undefined) {
            res.status(404);
        }

        if(data !== undefined && data.error) {
            res.status(500);
        }

        res.json(data);
    }
}

let routerUtils = new RouterUtils();
export default routerUtils;