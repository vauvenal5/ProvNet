export default class EditModal {
    constructor(id = "", leaf) {
        this.id = id;
        this.open = false;
        this.leaf = leaf;
    }

    isLeaf() {
        return this.leaf;
    }

    static isLeaf(self) {
        return self.isLeaf();
    }

    setId(id) {
        return this.softClone({id: id});
    }

    getId() {
        return this.id;
    }

    static getId(modal) {
        return modal.getId();
    }

    isOpen() {
        return this.open;
    }

    setOpen(value) {
        return this.softClone({open: value});
    }

    static setOpen(modal, value) {
        return modal.setOpen(value);
    }

    softClone(o) {
        return Object.assign(new EditModal(), this, o);
    }
}