import * as Rx from "rxjs";
import { 
    map,  
    flatMap, 
    catchError} from "rxjs/operators";
import web3Provider from "../web3Provider";
import links from "../links";
import details from "../details";
import types from "../types";

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