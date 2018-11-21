export default class TagArray {
    constructor(title="", tags=[]) {
        this.title = title;
        this.tags = tags;
    }

    static getTitle(self) {
        return self.title;
    }

    static getTags(self) {
        return self.tags;
    }

    static hasTag(self, tag) {
        return self.tags.includes(tag);
    }
}