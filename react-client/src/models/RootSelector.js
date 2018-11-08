import {reducer as specialRolesReducer} from "../UsersView";

export default class RootSelector {

    constructor(state) {
        this.state = state;
    }

    static getContracts(state) {
        return state.contracts;
    }

    getTags() {
        return this.state.tags;
    }

    static getTags(state) {
        return state.tags;
    }

    getSelect() {
        return this.state.select;
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

    static getLinks(state) {
        return state.links;
    }
}