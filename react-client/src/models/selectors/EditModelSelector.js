import ContractEditModelMap from "../maps/ContractEditModelMap";
import EditModelMap from "../maps/EditModelMap";
import SelectSelector from "./SelectSelector";
import ContractBasedId from "../ContractBasedId";

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
        let id = SelectSelector.getUserEditModel(root);
        return EditModelMap.get(map, id);
    }

    static getContractSelectedFor(root, address) {
        let map = EditModelSelector.getMap(root);
        return ContractEditModelMap.get(map, address);
    }

    static getSelectedEditModel(root) {
        let selected = SelectSelector.getEditModel(root);
        let map = EditModelSelector.getContractSelectedFor(
            root, 
            ContractBasedId.getAddress(selected)
        );
        return EditModelMap.get(map, ContractBasedId.getId(selected));
    }
}