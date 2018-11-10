import { SelectSelector, ProvContract, ContractDetails } from "..";
import ProvContractMap from "../maps/ProvContractMap";
import Select from "../Select";

export default class ProvContractSelector {
    static key = "contracts";

    static getMap(root) {
        return root[ProvContractSelector.key];
    }

    static isLoaded(root, address) {
        return ProvContractMap.has(ProvContractSelector.getMap(root), address);
    }

    static getSelected(root) {
        let address = SelectSelector.getSelectedContract(root);
        let map = ProvContractSelector.getMap(root);
        return ProvContractMap.get(map, address);
    }

    static getLinkSelectedContractTitles(root) {
        let map = ProvContractSelector.getMap(root);
        let select = SelectSelector.getSelectedList(root);

        return select.map(selected => {
            return ContractDetails.getTitle(ProvContract.getDetails(ProvContractMap.get(map, selected)));
        })
    }
}