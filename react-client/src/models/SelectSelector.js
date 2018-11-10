import Select from "./Select";

export default class SelectSelector {

    static getKey() {
        return "select";
    }

    static getSelect(root) {
        return root[SelectSelector.getKey()];
    }

    static getSelectedContract(root) {
        let select = SelectSelector.getSelect(root);
        return Select.getSelectedContract(select);
    }

    static getSelectedLink(root) {
        let select = SelectSelector.getSelect(root);
        return Select.getLinkSelectedContract(select);
    }
}