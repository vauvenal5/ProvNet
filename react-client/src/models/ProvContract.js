import TagList from "./TagList";
import LinkList from "./LinkList";
import ContractDetails from "./ContractDetails";

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

    getTags() {
        return this.tags;
    }

    setTags(tags) {
        return this.softClone({tags: tags});
    }

    setDetails(details) {
        return this.softClone({details: details});
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