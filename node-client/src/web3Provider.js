import Web3 from "web3";
import * as Rx from "rxjs";
import { map, flatMap, catchError, first } from "rxjs/operators";
const fs = require('fs');

import SimpleProvenanceContract from "ProvNet/build/contracts/SimpleProvenanceContract";

class Web3Provider {
    constructor(url) {
        this.web3 = new Web3(new Web3.providers.HttpProvider(url));
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
        return this.account.address;
    }

    estimateAndSendOperator = () => flatMap(func => Rx.from(func.estimateGas({from: this.getAddress()})).pipe(
        map(gas => {
            console.log("Estimated gas: " + gas);
            gas = parseInt(parseInt(gas)*1.1);
            console.log("Sent gas: " + gas);
            return gas;
        }),
        // flatMap(gas => Rx.from(
        //     func.send({from: this.getAddress(), gas: gas, gasPrice: 31})
        // ).pipe(
        flatMap(gas => Rx.fromEvent(
            func.send({from: this.getAddress(), gas: gas, gasPrice: 31}), "receipt"
        ).pipe(
            first(resp => true),
            map(resp => {
                console.log("Used gas: " + resp.gasUsed);
                return resp;
            }),
            catchError(err => {
                console.log(err);
                return Rx.of({error: err.toString()});
            })
        )),
        catchError(err => {
            console.log(err);
            return Rx.of({error: err.toString()});
        })
    ));
}

const web3Provider = new Web3Provider(process.env.URL);
export default web3Provider;