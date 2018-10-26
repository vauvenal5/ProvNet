import TagList from "./TagList";
import LinkList from "./LinkList";
import ContractDetails from "./ContractDetails";
import ProvContractList from "./ProvContractList";

export default class ProvContract {
    constructor(address=undefined, details) {
        this.address = address;
        this.details = new ContractDetails();
        this.tags = new TagList();
        this.links = new LinkList();
    }

    getAddress() {
        return this.address;
    }

    static getAddress(contract) {
        return contract.getAddress();
    }

    getTags() {
        return this.tags;
    }

    setTags(tags) {
        return this.softClone({tags: tags});
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
        return contract.getDetails();
    }

    getLinks() {
        return this.links;
    }

    setLinks(links) {
        return this.softClone({links: links});
    }

    softClone(o) {
        return Object.assign(new ProvContract(), this, o);
    }
}