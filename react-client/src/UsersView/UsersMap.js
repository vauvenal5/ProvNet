import { User, MapModel } from "../models";

export default class UsersMap extends MapModel {
    constructor(id) {
        super(
            id,
            User.getAddress,
            (id) => new User(id)
        );
    }
}