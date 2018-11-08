import {reducer as specialRolesReducer} from "../UsersView";

export default class RootSelector {
    static getContracts(state) {
        return state.contracts;
    }

    static getSelect(state) {
        return state.select;
    }

    static getSpecialRoles(state) {
        return state[specialRolesReducer.root];
    }

    static getUsers(state) {
        return state.users;
    }
}