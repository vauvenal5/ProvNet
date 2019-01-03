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

    static create() {
        return new Path();
    }

    static getContractVar() {
        return "contract";
    }
}