export default class UserSelector {
    static key = "users";

    static getContractSelected(root) {
        return root[UserSelector.key];
    }
}