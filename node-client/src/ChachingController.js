export default class CachingController {
    constructor(idFunc = id => id) {
        this.deploymentState = {};
        this.idFunc = idFunc;
    }

    deployed(id, result) {
        this.deploymentState[this.idFunc(id)] = {deploying: false, result};
    }

    deploying(id) {
        this.deploymentState[this.idFunc(id)] = {deploying: true};
        return id;
    }

    isDeploying(id) {
        let deployment = this.deploymentState[this.idFunc(id)];
        
        if(deployment === undefined) {
            return false;
        }

        return true;
    }

    checkDeploymentState = (id) => {
        let deployment = this.deploymentState[this.idFunc(id)];
        
        if(deployment !== undefined && !deployment.deploying) {
            delete this.deploymentState[this.idFunc(id)];
            return deployment.result;
        }
        
        return undefined;
    }
}