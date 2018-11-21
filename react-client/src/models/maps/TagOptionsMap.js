import TagsMap from "./TagsMap";

export default class TagOptionsMap extends TagsMap {
    constructor(id, title, icon) {
        super(id);
        this.title = title;
        this.icon = icon;
    }

    softClone(o) {
        return Object.assign(new TagOptionsMap(), this, o);
    }

    static getTitle(self) {
        return self.title;
    }

    static getIcon(self) {
        return self.icon;
    }

    static fromTagsMap(id, title, icon, map) {
        return Object.assign(
            new TagOptionsMap(id, title, icon), 
            map, 
            {id: id}
        );
    }
}