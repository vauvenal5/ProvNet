export default class User {
    constructor(address="", specialRoles=[], roles=[], isOwner=false) {
        this.address = address;
        this.specialRoles = specialRoles;
        this.roles = roles;
        this.owner = isOwner;
    }

    static getAddress(self) {
        return self.address;
    }

    static getSpecialRoles(self) {
        return self.specialRoles;
    }

    static getRoles(self) {
        return self.roles;
    }

    static isOwner(self) {
        return self.owner;
    }
}