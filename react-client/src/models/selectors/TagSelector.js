import SelectSelector from "./SelectSelector"
import ContractTagsMap from "../maps/ContractTagsMap";
import TagsMap from "../maps/TagsMap";

export default class TagSelector {

    static key = "tags";

    static getTagsMap(root) {
        return root[TagSelector.key];
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