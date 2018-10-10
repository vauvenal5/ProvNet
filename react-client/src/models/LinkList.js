export default class LinkList {
    constructor(...links) {
        this.loaded = 0;
        this.links = [...links];
    }

    addLink(link) {
        return this.softClone({links: [...this.links, link]});
    }

    asArray() {
        return this.links;
    }

    getLinkAt(index=0) {
        return this.links[0];
    }

    softClone(o) {
        return Object.assign(new LinkList(), this, o);
    }
}