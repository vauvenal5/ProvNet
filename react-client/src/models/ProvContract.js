export default class ProvContract {
    constructor(address) {
        this.address = address;
        this.details = {
            logoUrl: "",
            description: "",
        };
        this.types = {};
        this.links = [];
    }
}