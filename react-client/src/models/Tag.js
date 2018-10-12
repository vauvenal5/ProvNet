export default class Tag {
    constructor(id, title) {
        this.id = id;
        this.title = title;
    }

    getId() {
        return this.id;
    }

    getTitle() {
        return this.title;
    }
}