import ProvContract from "./ProvContract";

export default class ProvContractList {
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

    static getContract(self, address) {
        return self.getContract(address);
    }

    assignContract(contract) {
        return this.softClone({[contract.address]: contract});
    }

    softClone(o) {
        return Object.assign(new ProvContractList(), this, o);
    }

    static getSelf(state) {
        return state.contracts;
    }
}