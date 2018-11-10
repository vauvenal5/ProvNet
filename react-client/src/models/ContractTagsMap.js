import ContractListMap from "./ContractListMap";
import RootSelector from "./RootSelector";
import Tag from "./Tag";
import TagsMap from "./TagsMap";

export default class ContractTagsMap extends ContractListMap {
    constructor(id) {
        //super(id, (item) => Tag.getId(item), (id) => new Tag(id));
        super(id);
    }

    getNewList(id) {
        return new TagsMap(id);
    }
    // static get(root, address) {
    //     let self = RootSelector.getTags(root);
    //     return ContractListMap.get(self, address);
    // }
}