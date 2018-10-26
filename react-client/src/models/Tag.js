export default class Tag {
    constructor(id, title) {
        this.id = id;
        this.title = title;
    }

    getId() {
        return this.id;
    }

    static getId(self) {
        return self.getId();
    }

    getTitle() {
        return this.title;
    }

    static getTitle(self) {
        return self.getTitle();
    }
}