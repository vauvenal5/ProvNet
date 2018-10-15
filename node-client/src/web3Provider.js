import Web3 from "web3";
import { map } from "rxjs/operators";

import SimpleProvenanceContract from "ProvNet/build/contracts/SimpleProvenanceContract";

class Web3Provider {
    constructor() {
        this.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:9545/'));
    }

    getWeb3() {
        return this.web3;
    }

    createContract(abi, address) {
        return new this.web3.eth.Contract(abi, address);
    }

    simpleProvenanceContractOperator() {
        return map(address => this.createContract(SimpleProvenanceContract.abi, address));
    }
}

const web3Provider = new Web3Provider();
export default web3Provider;