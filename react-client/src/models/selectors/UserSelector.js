import UsersMap from "../maps/UsersMap";

export default class UserSelector {
    static key = "users";

    static getContractSelected(root) {
        return root[UserSelector.key];
    }

    static getContractSelectedUser(root, id) {
        let list = UserSelector.getContractSelected(root);
        return UsersMap.get(list, id);
    }
}