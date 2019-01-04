class ContractUtils {
    constructor(deployer, instance) {
        this.instance = instance;
        this.deployer = deployer;
    }

    addProvenance (url, content) {
        this.deployer.then(() => this.instance.putProvenanceRecord(url, content));
        return this;
    }

    twoWayLink (contract, tl1, tl2) {
        this.addLink(contract, tl1);
        contract.addLink(this, tl2);
        return this;
    };

    addLink (contract, type) {
        this.deployer.then(() => this.instance.addLink(contract.instance.address, type));
        return this;
    };
}

module.exports = ContractUtils;