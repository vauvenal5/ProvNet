import ProvContract from "./ProvContract";

export default class ProvContractList {
    constructor() {
        this.selected = [];
    }

    isLoaded(address) {
        return (this[address] !== undefined);
    }

    getContract(address) {
        let contract = this[address];
        if(contract === undefined) {
            return new ProvContract();
        }
        return contract;
    }

    assignContract(contract) {
        return this.softClone({[contract.address]: contract});
    }

    setLinkSelected(address) {
        let index = this.selected.indexOf(address);
        if(index >= 0) {
            return this.softClone({
                selected: this.selected.slice(0, (index+1))
            });
        }
        return this.softClone({selected: [...this.selected, address]});
    }

    setSelected(address) {
        return this.softClone({selected: [address]});
    }

    getSelectedList() {
        return this.selected;
    }

    getSelectedContract() {
        return this.getContract(this.getSelectedList()[0]);
    }

    getLinkSelectedContract() {
        let list = this.getSelectedList();
        return this.getContract(list[list.length-1]);
    }

    softClone(o) {
        return Object.assign(new ProvContractList(), this, o);
    }
}