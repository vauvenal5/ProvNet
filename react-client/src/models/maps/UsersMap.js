import MapModel from "./MapModel";
import User from "../User";

export default class UsersMap extends MapModel {
    constructor(id) {
        super(
            id,
            User.getAddress,
            (id) => new User(id)
        );
    }
}