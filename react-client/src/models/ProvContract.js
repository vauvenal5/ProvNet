export default class ProvContract {
    constructor(address, web3Instance = undefined) {
        this.address = address;
        this.web3Instance = web3Instance;
        this.types = {};
        this.links = [];
    }
}