export default class UriSelector {
    static key = "uris";

    static getContractSelected(root) {
        return root[UriSelector.key];
    }
}