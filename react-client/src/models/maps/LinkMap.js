import MapModel from "./MapModel";
import Link from "../Link";

export default class LinkMap extends MapModel {
    constructor(id) {
        super(
            id,
            Link.getAddress,
            (id) => new Link(id)
        )
    }
}