export default class SpecialRoleSelector {
    static key = "specialRoles"

    static getContractSelected(root) {
        return root[SpecialRoleSelector.key];
    }
}