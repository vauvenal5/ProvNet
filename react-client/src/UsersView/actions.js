import { User } from "../models";

export const types = {
    userLoaded: "USER_LOADED"
};

export const onUserLoaded = (address, specialRoles, roles, isOwner) => ({
    type: types.userLoaded,
    user: new User(address, specialRoles, roles, isOwner)
});