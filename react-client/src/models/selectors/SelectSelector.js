import Select from "../Select";

export default class SelectSelector {

    static getKey() {
        return "select";
    }

    static getSelect(root) {
        return root[SelectSelector.getKey()];
    }

    static getSelectedList(root) {
        return Select.getSelectedList(SelectSelector.getSelect(root));
    }

    static isContractSelected(root) {
        return Select.isRootSelected(SelectSelector.getSelect(root));
    }

    static getSelectedContract(root) {
        let select = SelectSelector.getSelect(root);
        return Select.getSelectedContract(select);
    }

    static getSelectedLink(root) {
        let select = SelectSelector.getSelect(root);
        return Select.getLinkSelectedContract(select);
    }

    static getTagEditModal(root) {
        let select = SelectSelector.getSelect(root);
        return Select.getTagEditModel(select);
    }

    static getUserEditModel(root) {
        let select = SelectSelector.getSelect(root);
        return Select.getEditUserSelect(select);
    }
}