export default class ContractBasedId {
    constructor(address = "", id = "") {
        this.address = address;
        this.id = id;
    }

    getAddress() {
        return this.address;
    }

    static getAddress(self) {
        return self.getAddress();
    }

    getId() {
        return this.id;
    }

    static getId(self) {
        return self.getId();
    }

    equals(o) {
        if(this.address === o.address 
        && this.id === o.id) {
            return true;
        }
        return false;
    }

    static equlas(self, o) {
        return self.equals(o);
    }
}