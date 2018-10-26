export default class TagList {
    constructor(...tags) {
        tags.map((tag) => this[tag.getId()] = tag);
    }

    addTag(tag) {
        return this.softClone({[tag.id]: tag});
    }

    getTag(id) {
        return this[id];
    }

    static getTag(self, id) {
        return self.getTag(id);
    }

    softClone(o) {
        return Object.assign(new TagList(), this, o);
    }
}