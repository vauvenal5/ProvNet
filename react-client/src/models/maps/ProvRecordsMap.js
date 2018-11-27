import MapModel from "./MapModel";
import ProvRecords from "../ProvRecords";

export default class ProvRecordsMap extends MapModel {
    constructor(id) {
        super(id, (item) => ProvRecords.getUri(item), (id) => new ProvRecords(id));
    }
}