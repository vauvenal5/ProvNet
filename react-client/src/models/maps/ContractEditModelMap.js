import ContractBaseMap from "./ContractBaseMap";
import EditModelMap from "./EditModelMap";

export default class ContractEditModelMap extends ContractBaseMap {
    constructor(id) {
        super(id);
    }

    getNewList(id) {
        return new EditModelMap(id);
    }
}