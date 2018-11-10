import MapModel from "./MapModel";
import ProvContract from "../ProvContract";

export default class ProvContractMap extends MapModel {
    constructor(id) {
        super(
            id,
            ProvContract.getAddress,
            (id) => new ProvContract(id)
        );
    }

    softClone(o) {
        return Object.assign(new ProvContractMap(), this, o);
    }
}