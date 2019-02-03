export default class Contract {
    constructor(title, address, children = [], tag = 1) {
        this.title = title;
        this.address = address;
        this.children = children;
        this.tag = tag;
    }
}