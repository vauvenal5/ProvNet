import TagArrayMap from "./maps/TagArrayMap";
import TagArray from "./TagArray";

export default class User extends TagArrayMap {
    static specialKey = "special";
    static roleKey = "link";

    constructor(address="", specialRoles=[], roles=[], isOwner=false) {
        super(
            address,
            new TagArray(User.specialKey, specialRoles),
            new TagArray(User.roleKey, roles)
        );
        this.address = address;
        //this.specialRoles = specialRoles;
        //this.roles = roles;
        this.owner = isOwner;
    }

    static getAddress(self) {
        return self.address;
    }

    static hasRole(self, role) {
        let roles = TagArrayMap.get(self, User.roleKey);
        return TagArray.hasTag(roles, role);
    }

    static hasSpecialRole(self, role) {
        let specials = TagArrayMap.get(self, User.specialKey);
        return TagArray.hasTag(specials, role);
    }

    static getSpecialRoles(self) {
        let specials = TagArrayMap.get(self, User.specialKey);
        return TagArray.getTags(specials);
    }

    static getRoles(self) {
        let roles = TagArrayMap.get(self, User.roleKey);
        return TagArray.getTags(roles);
    }

    static isOwner(self) {
        return self.owner;
    }
}