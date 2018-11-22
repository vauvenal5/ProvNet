import SelectSelector from "./SelectSelector";
import ContractLinkMap from "../maps/ContractLinksMap";
import LinkMap from "../maps/LinkMap";
import ContractBasedId from "../ContractBasedId";
import EditModelSelector from "./EditModelSelector";


export default class LinkSelector {
    static key = "links";

    static getMap(root) {
        return root[LinkSelector.key];
    }

    static getLinks(root, address) {
        let map = LinkSelector.getMap(root);
        return ContractLinkMap.get(map, address);
    }

    static getLinkSelectedLinks(root) {
        let selected = SelectSelector.getSelectedLink(root);
        return LinkSelector.getLinks(root, selected);
    }

    static getLinkSelectedLink(root, id) {
        let map = LinkSelector.getLinkSelectedLinks(root);
        return LinkMap.get(map, id);
    }

    static getLink(root, address, id) {
        let map = LinkSelector.getLinks(root, address);
        return LinkMap.get(map, id);
    }

    static getEditSelectedLink(root) {
        let selected = EditModelSelector.getSelectedKey(root);
        return LinkSelector.getLink(
            root, 
            ContractBasedId.getAddress(selected), 
            ContractBasedId.getId(selected)
        );
    }

    static getEditSelectedLinks(state) {
        let selected = EditModelSelector.getSelectedKey(state);
        return LinkSelector.getLinks(state, ContractBasedId.getAddress(selected));
    }
}