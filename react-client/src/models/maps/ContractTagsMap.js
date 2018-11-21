import ContractBaseMap from "./ContractBaseMap";
import TagsMap from "./TagsMap";

export default class ContractTagsMap extends ContractBaseMap {
    constructor(id, ...items) {
        super(id, (id) => new TagsMap(id), ...items);
    }
}