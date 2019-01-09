export default class Path {
    constructor(path = "") {
        this.path = path;
    }

    addContracts() {
        return this.addPath("/contracts");
    }

    addContractVar() {
        return this.addPath("/:"+Path.getContractVar());
    }

    addLinks() {
        return this.addPath("/links");
    }

    addPath(path) {
        this.path = this.path + path;
        return this;
    }

    addTypes() {
        return this.addPath("/types");
    }

    getPath() {
        return this.path;
    }

    addDetails() {
        return this.addPath("/details");
    }

    addSearch() {
        return this.addPath("/search");
    }

    addDeploy() {
        return this.addPath("/deploy");
    }

    addUsers() {
        return this.addPath("/users");
    }

    addUserVar() {
        return this.addPath("/:"+ Path.getUserVar());
    }

    addVar(name) {
        return this.addPath("/:"+name);
    }

    static create() {
        return new Path();
    }

    static getContractVar() {
        return "contract";
    }

    static getUserVar() {
        return "user";
    }

    static getLinkVar() {
        return "link";
    }
}