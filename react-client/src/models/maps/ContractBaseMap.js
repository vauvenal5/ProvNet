import MapModel from "./MapModel";

export default class ContractBaseMap extends MapModel {
    constructor(id, createNewList, ...items) {
        super(
            id, 
            (list) => MapModel.getId(list), 
            (id) => createNewList(id),
            ...items
        );
    }

    add(address, item) {
        let list = super.get(address);
        list = MapModel.add(list, item);
        return super.add(list);
    }

    static add(self, address, item) {
        return self.add(address, item);
    }

    softClone(o) {
        return Object.assign(new ContractBaseMap(), this, o);
    }
}