import ContractBaseMap from "./ContractBaseMap";
import LinkMap from "./LinkMap";

export default class ContractLinkMap extends ContractBaseMap {
    constructor(id) {
        super(id);
    }

    getNewList(id) {
        return new LinkMap(id);
    }
}