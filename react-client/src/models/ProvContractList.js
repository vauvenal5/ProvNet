import ProvContract from "./ProvContract";

export default class ProvContractList {
    constructor() {
        this.selected = [];
    }

    getContract(address) {
        return this[address];
    }

    assignContract(contract) {
        return this.softClone({[contract.address]: contract});
    }

    setSelected(address) {
        return this.softClone({selected: [address]});
    }

    getSelectedList() {
        return this.selected;
    }

    getSelectedContract() {
        let contract = this.getContract(this.getSelectedList()[0]);
        if(contract === undefined) {
            return new ProvContract();
        }
        return contract;
    }

    softClone(o) {
        return Object.assign(new ProvContractList(), this, o);
    }
}