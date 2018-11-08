export default class Select {
    constructor(self) {
        this.selected = [];
        if(self) {
            this.selected = self.selected;
        }
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

    static getSelectedContract(list) {
        return list.getSelectedContract();
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

    softClone(o) {
        return Object.assign(new Select(), this, o);
    }
}