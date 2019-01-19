import * as Rx from "rxjs";
import { 
    map,  
    flatMap, 
    catchError,
    filter,
    concatMap} from "rxjs/operators";
import web3Provider from "../web3Provider";
import links from "../links";
import details from "../details";
import types from "../types";

import SimpleProvenanceContract from "ProvNet/build/linked/SimpleProvenanceContract";
import CachingController from "../ChachingController";


class Controller extends CachingController {

    constructor() {
        super(id => {
            if(typeof id === "string") {
                return id;
            }

            let {uuid} = id;

            return uuid;
        });
        this.provenanceSubject = new Rx.Subject();
        this.deploySubject = new Rx.Subject();

        this.provenanceSubject.pipe(
            map(provReq => this.deploying(provReq)),
            concatMap(({address, url, prov, uuid}) => Rx.of(address).pipe(
                web3Provider.simpleProvenanceContractOperator(),
                map(web3Contract => web3Contract.methods.putProvenanceRecord(url, prov)),
                web3Provider.estimateAndSendOperator(),
                map(resp => ({resp, provReq: {address, url, prov, uuid}}))
            ))
        ).subscribe(({resp, provReq}) => this.deployed(provReq, resp));

        this.deploySubject.pipe(
            map(title => this.deploying(title)),
            concatMap((title) => Rx.of(undefined).pipe(
                web3Provider.simpleProvenanceContractOperator(),
                flatMap(web3Contract => Rx.from(
                    web3Provider.getWeb3().eth.net.getId()
                ).pipe(
                    map(id => SimpleProvenanceContract.binary[id]),
                    flatMap(data => {
                        if(data === undefined) {
                            return Rx.throwError("No binary found for network!");
                        }
    
                        return Rx.of(data);
                    }),
                    map(data => web3Contract.deploy({data: data})),
                    web3Provider.estimateAndSendOperator(),
                )),
                // flatMap(contract => Rx.of(contract.contractAddress).pipe(
                //     web3Provider.simpleProvenanceContractOperator(),
                //     map(web3Contract => web3Contract.methods.setTitle(title)),
                //     web3Provider.estimateAndSendOperator(),
                //     map(res => contract)
                // )),
                map(contract => ({title, contract}))
            ))
        ).subscribe(({title, contract}) => {
            console.log(title + ": " + contract.contractAddress);
            //cb(contract);//todo-sv: log also title costs
            this.deployed(title, contract);
        });
    }

    loadContractObservable = (address) => Rx.of(address).pipe(
        web3Provider.simpleProvenanceContractOperator(),
        flatMap(web3Contract => Rx.forkJoin(
            details.observables.detailsLoadObservable(web3Contract),
            types.observables.typesLoadObservable(web3Contract),
            links.observables.linksLoadObservable(web3Contract)
        ).pipe(
            map(([details, types, links]) => ({details: details, types: types, links}))
        )),
    );

    // controller.pushProvenance = (address, url, prov) => Rx.of(address).pipe(
    //     web3Provider.simpleProvenanceContractOperator(),
    //     map(web3Contract => web3Contract.methods.putProvenanceRecord(url, prov)),
    //     web3Provider.estimateAndSendOperator()
    // );

    
    pushProvenance(address, url, prov, uuid) { 
        this.provenanceSubject.next({address, url, prov, uuid});
    }
    
    deployContract(title) {
        this.deploySubject.next(title);
    }

}

let controller = new Controller();
export default controller;