import Web3 from "web3";
import * as Rx from "rxjs";
import { map, flatMap, catchError, first, delay } from "rxjs/operators";
const fs = require('fs');

import SimpleProvenanceContract from "ProvNet/build/contracts/SimpleProvenanceContract";

class Web3Provider {
    constructor(network, url) {
        let keysPath = "./.keys";
        let configPath = keysPath + "/config." + network + ".json";
        if(!fs.existsSync(keysPath)) {
            fs.mkdirSync(keysPath);
        }
        
        let config = {};
        let account;

        //load config
        if(fs.existsSync(configPath)) {
            
            config = JSON.parse(fs.readFileSync(configPath, "utf8"));
        }
        
        if(config.url === undefined) {
            config.url = url;
        }

        this.web3 = new Web3(new Web3.providers.HttpProvider(config.url, 36000000));
        this.web3.eth.accounts.wallet.create();

        //load or create account
        if(config.account === undefined) {
            account = this.web3.eth.accounts.create();
        } else {
            account = this.web3.eth.accounts.privateKeyToAccount(config.account.privateKey);
        }

        config.account = {
            address: account.address,
            privateKey: account.privateKey
        };

        console.log("Node client will be using:");
        console.log(config);
        //update config
        fs.writeFileSync(configPath, JSON.stringify(config, null, 4), "utf8");
        
        this.config = config;
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
        return this.config.account.address;
    }

    estimateAndSendOperator = () => flatMap(func => Rx.from(func.estimateGas({from: this.getAddress()})).pipe(
        map(gas => {
            console.log("Estimated gas: " + gas);
            gas = parseInt(parseInt(gas)*1.025);
            console.log("Sent gas: " + gas);
            return gas;
        }),
        delay(1000),//this delay is only to give infura node time to sync(?); trying to avoid: Returned error: known transaction:...
        // flatMap(gas => Rx.from(
        //     func.send({from: this.getAddress(), gas: gas, gasPrice: 31})
        // ).pipe(
        flatMap(gas => Rx.fromEvent(
            func.send({from: this.getAddress(), gas: gas, gasPrice: 11000000000}), "receipt"
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

const web3Provider = new Web3Provider(process.env.network, process.env.URL);
export default web3Provider;