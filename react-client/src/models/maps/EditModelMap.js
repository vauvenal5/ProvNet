import { MapModel } from "..";
import EditModel from "../EditModel";

export default class EditModelMap extends MapModel {
    constructor(id) {
        super(
            id,
            EditModel.getId,
            (id) => new EditModel(id)
        );
    }
}