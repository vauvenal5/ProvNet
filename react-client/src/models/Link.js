export default class Link {
    constructor(address="", tags=[], title="") {
        this.address = address;
        this.tags = tags;
        this.title = title;
    }

    getAddress() {
        return this.address;
    }

    getTitle() {
        return this.title;
    }

    getTags() {
        return this.tags;
    }
}