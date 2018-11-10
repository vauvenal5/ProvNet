import MapModel from "./MapModel";
import Tag from "./Tag";

export default class TagsMap extends MapModel {
    constructor(id) {
        super(id, (item) => Tag.getId(item), (id) => new Tag(id));
    }
}