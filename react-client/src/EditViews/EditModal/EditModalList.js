import EditModal from "./EditModal";
import EditModalLeaf from "./EditModalLeaf";

export default class EditModalList extends EditModal {
    constructor(id) {
        super(id, false);
        this.modals = {};
    }

    softClone(o) {
        return Object.assign(new EditModalList(), this, o);
    }

    // getModal(id) {
    //     return this.modals[id];
    // }

    // static getModal(self, id) {
    //     return self.getModal(id);
    // }

    getModal(...selectors) {
        let [selector, ...rest] = selectors;
        let modal = this.modals[selector];

        if(rest.length === 0 || modal === undefined) {
            return modal;
        }

        return modal.getModal(...rest);
    }

    static getModal(self, ...selectors) {
        return self.getModal(...selectors);
    }

    // setModal(modal) {
    //     return this.softClone({
    //         modals: {
    //             ...this.modals,
    //             [EditModal.getId(modal)]: modal
    //         }
    //     });
    // }

    setModal(modal, ...selectors) {
        if(selectors.length == 0) {
            selectors.push(EditModal.getId(modal));
        }

        let [selector, ...rest] = selectors;
        let m = this.getModal(selector);

        if(EditModal.isLeaf(m)) {
            m = modal;
        } else {
            m = m.setModal(modal, ...rest);
        }

        return this.softClone({
            modals: {
                ...this.modals,
                [selector]: m
            }
        });
    }

    static setModal(self, modal, ...selectors) {
        return self.setModal(modal, ...selectors);
    }

    putOnce(modal) {
        let id = EditModal.getId(modal);
        let inner = this.getModal(id);

        if(inner === undefined) {
            inner = modal;
        } else {
            if(EditModal.isLeaf(modal)) {
                return this;
            }
                    
            for(let innerId in modal.modals) {
                inner = inner.putOnce(EditModalList.getModal(modal, innerId));
            }

            //if the reference is still equal then non of the children was manipulated and we can return without cloning
            if(inner == this.getModal(id)) {
                return this;
            }
        }

        return this.softClone({
            modals: {
                ...this.modals, 
                [id]: inner
            }
        });
    }

    /**
     * Only sets the new leaf if there does not exist a leaf with the same id.
     * @param {*} self 
     * @param {*} modal 
     */
    static putOnce(self, modal) {
        return self.putOnce(modal);
    }

    static create(id, leaf) {
        let list = new EditModalList(id);
        return list.putOnce(leaf);
    }
}