import ContractBasedId from "./ContractBasedId";

export default class Select {
    constructor() {
        this.selected = [];
        this.editLinkModel = new ContractBasedId();
        this.tagEditModel = undefined;
        this.editUserSelect = undefined;
    }

    setLinkSelected(address) {
        let index = this.selected.indexOf(address);
        if(index >= 0) {
            return this.softClone({
                selected: this.selected.slice(0, (index+1))
            });
        }
        return this.softClone({selected: [...this.selected, address]});
    }

    setSelected(address) {
        return this.softClone({selected: [address]});
    }

    static getSelectedList(self) {
        return self.selected;
    }

    getSelectedContract() {
        return this.selected[0];
    }

    static getSelectedContract(self) {
        return self.getSelectedContract();
    }

    isRootSelected() {
        return this.selected.length > 0;
    }

    static isRootSelected(list) {
        return list.isRootSelected();
    }

    static getLinkSelectedContract(list) {
        return list.selected[list.selected.length-1];
    }

    setEditModel(id, contract=this.selected[0]) {
        return this.softClone({
            editLinkModel: new ContractBasedId(contract, id)
        });
    }

    static setEditModel(self, id, contract) {
        return self.setEditModel(id, contract);
    }

    static getEditModel(self) {
        return self.editLinkModel;
    }

    static getEditModelContract(self) {
        return ContractBasedId.getAddress(self.editLinkModel);
    }

    setTagEditModel(id) {
        return this.softClone({tagEditModel: id});
    }

    static setTagEditModel(self, id) {
        return self.setTagEditModel(id);
    }

    static getTagEditModel(self) {
        return self.tagEditModel;
    }

    static setEditUserSelect(self, id) {
        return self.softClone({editUserSelect: id});
    }

    static getEditUserSelect(self) {
        return self.editUserSelect;
    }

    softClone(o) {
        return Object.assign(new Select(), this, o);
    }
}