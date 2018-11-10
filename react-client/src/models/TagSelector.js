import RootSelector from "./RootSelector";
import SelectSelector from "./SelectSelector"
import ContractTagsMap from "./ContractTagsMap";
import TagsMap from "./TagsMap";

export default class TagSelector {

    static getKey() {
        return "tags";
    }

    static getTagsMap(root) {
        return root[TagSelector.getKey()];
    }

    static getContractSelected(root) {
        let address = SelectSelector.getSelectedContract(root);
        let map = TagSelector.getTagsMap(root);
        return ContractTagsMap.get(map, address);
    }

    static getLinkSelected(root) {
        let address = SelectSelector.getSelectedLink(root);
        let map = TagSelector.getTagsMap(root);
        return ContractTagsMap.get(map, address);
    }

    static getContractSelectedTag(root, id) {
        let list = TagSelector.getContractSelected(root);
        return TagsMap.get(list, id);
    }
}