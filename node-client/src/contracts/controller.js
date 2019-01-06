import * as Rx from "rxjs";
import { 
    map,  
    flatMap, 
    catchError,
    filter} from "rxjs/operators";
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

controller.pushProvenance = (address, url, prov) => Rx.of(address).pipe(
    web3Provider.simpleProvenanceContractOperator(),
    map(web3Contract => web3Contract.methods.putProvenanceRecord(url, prov)),
    flatMap(func => Rx.from(func.estimateGas()).pipe(
        flatMap(gas => Rx.from(
            func.send({from: web3Provider.getAddress(), gas: gas})
        ).pipe(
            catchError(err => {
                console.log(err);
                return Rx.of({error: err.toString()});
            })
        ))
    ))
);

controller.deployContract = (title) => Rx.of(undefined).pipe(
    web3Provider.simpleProvenanceContractOperator(),
    flatMap(web3Contract => Rx.from(
        web3Provider.getWeb3().eth.net.getId()
    ).pipe(
        map(id => SimpleProvenanceContract.binary[id]),
        filter(data => data !== undefined),//todo-sv: this filter does not work!! it stops execution!
        map(data => web3Contract.deploy({data: data, arguments: [title]})),
        flatMap(prepared => Rx.from(prepared.estimateGas()).pipe(
            flatMap(gas => Rx.from(
                prepared.send({from: web3Provider.getAddress(), gas: 5000000})
            ).pipe(
                catchError(err => {
                    console.log(err);
                    return Rx.of({error: err.toString()});
                })
            ))
        ))
    ))
);