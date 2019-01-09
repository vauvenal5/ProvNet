import * as Rx from "rxjs";
import { 
    flatMap, 
    switchAll,
    reduce, 
    concatMap,
    map} from "rxjs/operators";
import Link from "../models/Link";
import web3Provider from "../web3Provider";

export const observables = {};
observables.linksLoadObservable = (web3Contract) => Rx.from(
    web3Contract.methods.getLinkList().call()
).pipe(
    switchAll(),
    flatMap(linkAddress => Rx.zip(
        web3Contract.methods.getLink(linkAddress).call(),
        Rx.of(linkAddress).pipe(
            web3Provider.simpleProvenanceContractOperator(),
            flatMap(web3linkContract => web3linkContract.methods.getTitle().call())
        ),
        (res, title) => new Link(res[0], res[1].filter(tag => tag != 0), title)
    )),
    reduce((links, link) => {
        links.push(link);
        return links;
    }, [])
);

export const controller = {};
controller.loadLinksObservable = (address) => Rx.of(address).pipe(
    web3Provider.simpleProvenanceContractOperator(),
    flatMap(web3Contract => observables.linksLoadObservable(web3Contract))
);

controller.addLinkSubject = new Rx.Subject();
controller.addLink = (contract, link, tag, cb) => controller.addLinkSubject.next({contract, link, tag, cb});
controller.addLinkSubject.pipe(
    concatMap(({contract, link, tag, cb}) => Rx.of(contract).pipe(
        web3Provider.simpleProvenanceContractOperator(),
        map(web3Contract => web3Contract.methods.addLink(link, tag)),
        web3Provider.estimateAndSendOperator(),
        map(resp => ({resp, cb}))
    ))
).subscribe(({resp, cb}) => cb(resp));