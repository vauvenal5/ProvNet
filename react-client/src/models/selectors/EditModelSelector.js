import ContractBaseMap from "../maps/ContractBaseMap";
import ContractEditModelMap from "../maps/ContractEditModelMap";
import EditModelMap from "../maps/EditModelMap";
import SelectSelector from "./SelectSelector";

export default class EditModelSelector {
    static key = "editModels";
    static newContractKey = "new";
    static detailsKey = "details";
    static userKey = "user";

    static getMap(root) {
        return root[EditModelSelector.key];
    }

    static getEditModel(root, address, id) {
        let self = this.getMap(root);
        let map = ContractEditModelMap.get(self, address);
        return EditModelMap.get(map, id);
    }

    static getTagSelectedEditModel(root) {
        let address = SelectSelector.getSelectedContract(root);
        let tag = SelectSelector.getTagEditModal(root);
        return EditModelSelector.getEditModel(root, address, tag);
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
        let map = EditModelSelector.getContractSelected(root);
        return EditModelMap.get(map, EditModelSelector.userKey);
    }
}