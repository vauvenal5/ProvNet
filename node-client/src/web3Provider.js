import Web3 from "web3";
import { map } from "rxjs/operators";
const fs = require('fs');

import SimpleProvenanceContract from "ProvNet/build/contracts/SimpleProvenanceContract";

class Web3Provider {
    constructor() {
        this.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545/'));
        let keysPath = "./.keys";
        let accountPath = keysPath + "/account.json"
        if(!fs.existsSync(keysPath)) {
            fs.mkdirSync(keysPath);
        }

        this.web3.eth.accounts.wallet.create();
        let account;

        if(!fs.existsSync(accountPath)) {
            account = this.web3.eth.accounts.create();
        } else {
            account = JSON.parse(fs.readFileSync(accountPath, "utf8"));
            account = this.web3.eth.accounts.privateKeyToAccount(account.privateKey);
        }

        console.log(account);
        fs.writeFileSync(accountPath, JSON.stringify({
            address: account.address,
            privateKey: account.privateKey
        }, null, 4), "utf8");
        this.account = account;
        this.web3.eth.accounts.wallet.add(account);
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

    getAddress() {
        console.log(this.account);
        return this.account.address;
    }
}

const web3Provider = new Web3Provider();
export default web3Provider;