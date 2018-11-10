import ContractListMap from "./ContractListMap";
import TagsMap from "./maps/TagsMap";

export default class ContractTagsMap extends ContractListMap {
    constructor(id) {
        super(id);
    }

    getNewList(id) {
        return new TagsMap(id);
    }
}