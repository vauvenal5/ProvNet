import ListModel from "./ListModel";

export default class ContractListMap extends ListModel {
    constructor(id, childGetIdFunc, childEmptyItemConstructor) {
        super(id, 
            (item) => ListModel.getId(item), 
            (id) => new ListModel(id, 
                (item) => childGetIdFunc(item), 
                (id) => childEmptyItemConstructor(id)
            )
        )
    }

    add(address, item) {
        let list = super.get(address);
        list = ListModel.add(list, item);
        return super.add(list);
    }

    static add(self, address, item) {
        return self.add(address, item);
    }

    softClone(o) {
        return Object.assign(new ContractListMap(), this, o);
    }
}