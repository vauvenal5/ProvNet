import * as Rx from "rxjs";
import { 
    map,  
    flatMap } from "rxjs/operators";
import ContractDetails from "../models/ContractDetails";
import web3Provider from "../web3Provider";


export const observables = {};
observables.detailsLoadObservable = (web3Contract) => Rx.forkJoin(
    web3Contract.methods.getDescription().call(),
    web3Contract.methods.getLogoUrl().call(),
    web3Contract.methods.getTitle().call(),
).pipe(
    map(([description, logoUrl, title]) => {
        return new ContractDetails(title, description, logoUrl);
    })
);

export const controller = {};
controller.loadContractDetails = (address) => Rx.of(address).pipe(
    web3Provider.simpleProvenanceContractOperator(),
    flatMap(web3Contract => observables.detailsLoadObservable(web3Contract))
);