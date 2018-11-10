import ContractListMap from "../ContractListMap";
import LinkMap from "./LinkMap";

export default class ContractLinkMap extends ContractListMap {
    constructor(id) {
        super(id);
    }

    getNewList(id) {
        return new LinkMap(id);
    }
}