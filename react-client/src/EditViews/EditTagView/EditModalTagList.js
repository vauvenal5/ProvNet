import {EditModalList} from "./imports";
import EditModal from "../EditModal";

export default class EditModalTagList extends EditModalList {
    constructor(id) {
        super(id);
        this.selected = {};
    }

    softClone(o) {
        return Object.assign(new EditModalTagList(), this, o);
    }

    getSelected() {
        return this.selected;
    }

    static getSelected(self) {
        return self.getSelected();
    }

    setSelected(...selectors) {
        let modal = this;
        selectors.forEach((selector) => modal = EditModalTagList.getModal(modal, selector));
        return this.softClone({selected: modal});
    }

    static setSelected(self, ...selectors) {
        return self.setSelected(...selectors);
    }
}