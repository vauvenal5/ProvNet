import EditModalLeaf from "../EditModal/EditModalLeaf";

export default class ContractDeployment extends EditModalLeaf {
    constructor(id) {
        super(id);
        this.address = "";
    }

    setAddress(address) {
        return this.softClone({address: address});
    }

    getAddress() {
        return this.address;
    }

    softClone(o) {
        return Object.assign(new ContractDeployment(), this, o);
    }
}