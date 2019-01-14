class ContractUtils {
    constructor(deployer, title) {
        this.deployer = deployer;
        this.title = title;
    }

    setDeployer (deployer) {
        this.deployer = deployer;
    }

    setInstance(instance) {
        this.instance = instance;
    }

    setTitle(title) {
        this.deployer.then(() => this.instance.setTitle(title));
        return this;
    }

    setDescription(desc) {
        this.deployer.then(() => this.instance.setDescription(desc));
        return this;
    }

    setLogoUrl(logo) {
        this.deployer.then(() => this.instance.setLogoUrl(logo));
        return this;
    }

    addUser(address, tag) {
        this.deployer.then(() => this.instance.addUser(address, tag));
        return this;
    }

    addProvenance (url, content) {
        this.deployer.then(() => this.instance.putProvenanceRecord(url, content));
        return this;
    }

    twoWayLink (contract2, tl1, tl2) {
        this.addLink(contract2, tl1);
        contract2.addLink(this, tl2);
        return this;
    };

    addLink (contract2, type) {
        this.deployer.then(() => this.instance.addLink(contract2.instance.address, type));
        return this;
    };

    printAddress() {
        let title = this.title + ":";
        console.log("\t"+title.padEnd(10)+"\t"+this.instance.address);
        //this.deployer.then(() => console.log(this.title+":"+this.instance.address));
    }
}

module.exports = ContractUtils;