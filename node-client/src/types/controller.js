import * as Rx from "rxjs";
import { 
    map,  
    flatMap, 
    switchAll,
    reduce } from "rxjs/operators";
import web3Provider from "../web3Provider";

export const observables = {};
observables.linkTypes = (web3Contract) => Rx.from(
    web3Contract.methods.getLinkTypes().call()
);
observables.linkType = (web3Contract, id) => Rx.from(
    web3Contract.methods.getLinkType(id).call()
);

observables.typesLoadObservable = (web3Contract) => observables.linkTypes(web3Contract).pipe(
    switchAll(),
    flatMap(id => observables.linkType(web3Contract, id).pipe(
        map(type => ({id: id, type: type}))
    )),
    reduce((types, type) => {
        types.push(type);
        return types;
    }, [])
);

export const controller = {};
controller.loadContractTypesObservable = (address) => Rx.of(address).pipe(
    web3Provider.simpleProvenanceContractOperator(),
    flatMap(web3Contract => observables.typesLoadObservable(web3Contract))
);