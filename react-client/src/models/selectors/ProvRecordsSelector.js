import ProvRecordsMap from "../maps/ProvRecordsMap";
import EditModelSelector from "./EditModelSelector";
import ContractBasedId from "../ContractBasedId";

export default class ProvRecordsSelector {
    static key = "provRecords";

    static getMap(root) {
        return root[ProvRecordsSelector.key];
    }

    static getSelectedProvRecords(root) {
        let map = ProvRecordsSelector.getMap(root);
        let selected = EditModelSelector.getSelectedKey(root);
        return ProvRecordsMap.get(map, ContractBasedId.getId(selected));
    }
}