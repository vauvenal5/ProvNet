import LinkList from "./LinkList";
import ContractDetails from "./ContractDetails";

export default class ProvContract {
    constructor(address=undefined, details) {
        this.address = address;
        this.details = new ContractDetails();
        this.links = new LinkList();
    }

    getAddress() {
        return this.address;
    }

    static getAddress(contract) {
        return contract.getAddress();
    }

    static getTags(self) {
        return self.getTags();
    }

    setDetails(details) {
        return this.softClone({details: details});
    }

    getDetails() {
        return this.details;
    }

    static getDetails(contract) {
        if(contract === undefined) {
            return new ContractDetails();
        }
        return contract.getDetails();
    }

    getLinks() {
        return this.links;
    }

    setLinks(links) {
        return this.softClone({links: links});
    }

    setSpecialRoles(roles) {
        return this.softClone({specialRoles: roles});
    }

    softClone(o) {
        return Object.assign(new ProvContract(), this, o);
    }
}