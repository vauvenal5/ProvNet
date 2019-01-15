import * as Rx from "rxjs";
import { 
    map,  
    flatMap, 
    catchError,
    filter,
    concatMap} from "rxjs/operators";
import web3Provider from "../web3Provider";
import CachingController from "../ChachingController";

class Controller extends CachingController {
    constructor() {
        super(({contract, user, tag}) => contract+":"+user+":"+tag);

        this.getUserSubject = new Rx.Subject();
        this.getUserSubject.pipe(
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

        this.addUserSubject = new Rx.Subject();
        this.addUserSubject.pipe(
            map(userReq => this.deploying(userReq)),
            concatMap(({contract, user, tag}) => Rx.of(contract).pipe(
                web3Provider.simpleProvenanceContractOperator(),
                map(web3Contract => web3Contract.methods.addUser(user, tag)),
                web3Provider.estimateAndSendOperator(),
                map(resp => ({resp, userReq: {contract, user, tag}}))
            ))
        ).subscribe(({resp, userReq}) => this.deployed(userReq, resp));
    }

    getUser = (contract, user, cb) => this.getUserSubject.next({contract, user, cb});
    addUser = (contract, user, tag, cb) => this.addUserSubject.next({contract, user, tag, cb});
}

export const controller = new Controller();
