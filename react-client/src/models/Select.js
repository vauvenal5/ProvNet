export default class Select {
    constructor() {
        this.selected = [];
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