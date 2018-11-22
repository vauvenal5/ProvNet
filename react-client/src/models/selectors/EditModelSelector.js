import ContractEditModelMap from "../maps/ContractEditModelMap";
import EditModelMap from "../maps/EditModelMap";
import SelectSelector from "./SelectSelector";
import ContractBasedId from "../ContractBasedId";
import EditModel from "../EditModel";

export default class EditModelSelector {
    static key = "editModels";
    static newContractKey = "new";
    static detailsKey = "details";
    static userKey = "user";
    static tagKey = "tag";
    static linkKey = "link";

    static getMap(root) {
        return root[EditModelSelector.key];
    }

    static getEditModel(root, address, id) {
        let self = EditModelSelector.getMap(root);
        let map = ContractEditModelMap.get(self, address);
        return EditModelMap.get(map, id);
    }

    static getContractSelected(root) {
        let address = SelectSelector.getSelectedContract(root);
        let map = EditModelSelector.getMap(root);
        return ContractEditModelMap.get(map, address);
    }

    static getNewContractModel(root) {
        return EditModelSelector.getEditModel(root, EditModelSelector.newContractKey, EditModelSelector.newContractKey);
    }

    static getContractDetailsModel(root) {
        let address = SelectSelector.getSelectedContract(root);
        return EditModelSelector.getEditModel(root, address, EditModelSelector.detailsKey);
    }

    static getUserAddModel(root) {
        let address = SelectSelector.getSelectedContract(root);
        return EditModelSelector.getEditModel(root, address, EditModelSelector.userKey);
    }

    static getLinkAddModel(root) {
        let address = SelectSelector.getSelectedContract(root);
        return EditModelSelector.getEditModel(root, address, EditModelSelector.linkKey);
    }

    static getSelectedKey(root) {
        let map = EditModelSelector.getMap(root);
        return ContractEditModelMap.getSelected(map);
    }

    static getSelectedModel(root) {
        let map = EditModelSelector.getMap(root);
        let selected = ContractEditModelMap.getSelected(map);
        let selectedMap = ContractEditModelMap.get(map, ContractBasedId.getAddress(selected));
        return EditModelMap.get(selectedMap, ContractBasedId.getId(selected));
    }
}