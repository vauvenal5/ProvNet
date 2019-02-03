import * as Rx from "rxjs";
import { 
    map,  
    flatMap, 
    concatMap} from "rxjs/operators";
import ContractDetails from "../models/ContractDetails";
import web3Provider from "../web3Provider";
import CachingController from "../ChachingController";


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

class Controller extends CachingController {
    constructor() {
        super(details => details.title);

        this.setTitleSubject = new Rx.Subject();
        this.getTitleSubject = new Rx.Subject();

        this.setTitleSubject.pipe(
            map(details => this.deploying(details)),
            concatMap(({address, title}) => Rx.of(address).pipe(
                web3Provider.simpleProvenanceContractOperator(),
                map(web3Contract => web3Contract.methods.setTitle(title)),
                web3Provider.estimateAndSendOperator(),
                map(resp => ({resp, details: {address, title}}))
            ))
        ).subscribe(({resp, details}) => this.deployed(details, resp));

        this.getTitleSubject.pipe(
            flatMap(({address, cb}) => Rx.of(address).pipe(
                web3Provider.simpleProvenanceContractOperator(),
                flatMap(web3Contract => Rx.from(web3Contract.methods.getTitle().call())),
                map(title => ({title, cb}))
            ))
        ).subscribe(({title, cb}) => cb(title));
    }

    setTitle(address, title) {
        this.setTitleSubject.next({address, title});
    }

    getTitle(address, cb) {
        this.getTitleSubject.next({address, cb});
    }

    loadContractDetails = (address) => Rx.of(address).pipe(
        web3Provider.simpleProvenanceContractOperator(),
        flatMap(web3Contract => observables.detailsLoadObservable(web3Contract))
    );
}

let controller = new Controller();
export default controller;