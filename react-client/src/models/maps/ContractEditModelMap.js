import ContractBaseMap from "./ContractBaseMap";
import EditModelMap from "./EditModelMap";
import ContractBasedId from "../ContractBasedId";

export default class ContractEditModelMap extends ContractBaseMap {
    static modals = {
        deploy: "deployModal",
        details: "detailsModal",
        editTag: "editTagModal",
        editUser: "editUserModal",
        editLink: "editLinkModal",
        displayProv: "displayProv"
    }

    constructor(id) {
        super(id, (id) => new EditModelMap(id));
        this.selected = new ContractBasedId();
    }

    setSelected(address, id) {
        return this.softClone({
            selected: new ContractBasedId(address, id)
        });
    }

    getSelected() {
        return this.selected;
    }

    static getSelected(self) {
        return self.getSelected();
    }

    softClone(o) {
        return Object.assign(new ContractEditModelMap(), this, o);
    }
}