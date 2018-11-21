import MapModel from "./MapModel";
import TagArray from "../TagArray";

export default class TagArrayMap extends MapModel {
    constructor(id, ...items) {
        super(
            id,
            (item) => TagArray.getTitle(item),
            (id) => new TagArray(id),
            ...items
        );
    }
}