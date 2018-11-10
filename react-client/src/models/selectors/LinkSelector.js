import SelectSelector from "./SelectSelector";
import ContractLinkMap from "../maps/ContractLinksMap";

export default class LinkSelector {
    static key = "links";

    static getMap(root) {
        return root[LinkSelector.key];
    }

    static getLinkSelectedLinks(root) {
        let selected = SelectSelector.getSelectedLink(root);
        let map = LinkSelector.getMap(root);
        return ContractLinkMap.get(map, selected);
    }
}