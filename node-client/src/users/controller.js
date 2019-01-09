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

controller.getUserSubject = new Rx.Subject();
controller.getUserSubject.pipe(
    flatMap(({contract, user, cb}) => Rx.of(contract).pipe(
        web3Provider.simpleProvenanceContractOperator(),
        flatMap(web3Contract => Rx.from(web3Contract.methods.getUser(user).call())),
        map(user => ({
            user: user["0"],
            specials: user["1"],
            links: user["2"],
            isOwner: user["3"],
        })),
        map(user => ({user, cb}))
    )
)).subscribe(({user, cb}) => cb(user));
controller.getUser = (contract, user, cb) => controller.getUserSubject.next({contract, user, cb});


controller.addUserSubject = new Rx.Subject();
controller.addUser = (contract, user, tag, cb) => controller.addUserSubject.next({contract, user, tag, cb});
controller.addUserSubject.pipe(
    concatMap(({contract, user, tag, cb}) => Rx.of(contract).pipe(
        web3Provider.simpleProvenanceContractOperator(),
        map(web3Contract => web3Contract.methods.addUser(user, tag)),
        web3Provider.estimateAndSendOperator(),
        map(resp => ({resp, cb}))
    ))
).subscribe(({resp, cb}) => cb(resp));
