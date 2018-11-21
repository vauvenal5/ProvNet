import ContractBaseMap from "./ContractBaseMap";
import LinkMap from "./LinkMap";

export default class ContractLinkMap extends ContractBaseMap {
    constructor(id) {
        super(id, (id) => new LinkMap(id));
    }
}