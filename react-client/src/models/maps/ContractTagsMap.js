import ContractBaseMap from "./ContractBaseMap";
import TagsMap from "./TagsMap";

export default class ContractTagsMap extends ContractBaseMap {
    constructor(id) {
        super(id);
    }

    getNewList(id) {
        return new TagsMap(id);
    }
}