export default class Contract {
    constructor(title, address, children = []) {
        this.title = title;
        this.address = address;
        this.children = children;
    }
}