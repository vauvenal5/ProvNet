export default class TagList {
    constructor(...tags) {
        tags.map((tag) => this[tag.getId()] = tag);
    }

    addTag(tag) {
        return this.softClone({[tag.id]: tag});
    }

    softClone(o) {
        return Object.assign(new TagList(), this, o);
    }
}