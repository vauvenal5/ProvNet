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

export const controller = {};
controller.loadContractObservable = (address) => Rx.of(address).pipe(
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

controller.provenanceSubject = new Rx.Subject();
controller.pushProvenance = (address, url, prov, cb) => controller.provenanceSubject.next({address, url, prov, cb});
controller.provenanceSubject.pipe(
    concatMap(({address, url, prov, cb}) => Rx.of(address).pipe(
        web3Provider.simpleProvenanceContractOperator(),
        map(web3Contract => web3Contract.methods.putProvenanceRecord(url, prov)),
        web3Provider.estimateAndSendOperator(),
        map(resp => ({resp, cb}))
    ))
).subscribe(({resp, cb}) => cb(resp));

controller.deploySubject = new Rx.Subject();
controller.deployContract = (title, cb) => controller.deploySubject.next({title, cb});
controller.deploySubject.pipe(
    concatMap(({title, cb}) => Rx.of(undefined).pipe(
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
        flatMap(contract => Rx.of(contract.contractAddress).pipe(
            web3Provider.simpleProvenanceContractOperator(),
            map(web3Contract => web3Contract.methods.setTitle(title)),
            web3Provider.estimateAndSendOperator(),
            map(res => contract)
        )),
        map(contract => ({title, cb, contract}))
    ))
).subscribe(({title, cb, contract}) => {
    console.log(title + ": " + contract.contractAddress);
    cb(contract);//todo-sv: log also title costs
});