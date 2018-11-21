import TagArrayMap from "./maps/TagArrayMap";
import TagArray from "./TagArray";

export default class Link extends TagArrayMap {
    static tagsKey = "tags";

    constructor(address="", tags=[], title="") {
        super(
            address,
            new TagArray(Link.tagsKey, tags)
        );
        this.address = address;
        this.title = title;
    }

    getAddress() {
        return this.address;
    }

    static getAddress(self) {
        return self.getAddress();
    }

    getTitle() {
        return this.title;
    }

    getTags() {
        let tagArray = this.get(Link.tagsKey);
        return TagArray.getTags(tagArray);
    }
}