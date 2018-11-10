import MapModel from "./maps/MapModel";

export default class ContractListMap extends MapModel {
    constructor(id, childGetIdFunc, childEmptyItemConstructor) {
        super(id, (list) => MapModel.getId(list), (id) => this.getNewList(id, childGetIdFunc, childEmptyItemConstructor));
    }

    getNewList(id, childGetIdFunc, childEmptyItemConstructor) {
        return new MapModel(id, childGetIdFunc, childEmptyItemConstructor);
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
        return Object.assign(new ContractListMap(), this, o);
    }
}