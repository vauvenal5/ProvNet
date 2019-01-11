import * as Rx from "rxjs";
import { 
    map,  
    flatMap, 
    catchError,
    filter,
    reduce,
    sum,
    last,
    groupBy,
    count,
    max,
    min,
    first} from "rxjs/operators";
import * as Rp from "request-promise";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import Network from "./network";
import Contract from "./contract";
import PersistableHelper from "./PersistableHelper";

export default class CostCounter extends PersistableHelper {
    constructor(network, persist) {
        super(network, persist, "cost");

        let countOperator = (obs) => Rx.zip(
            obs.pipe(
                map(event => event.contract.length),
                first(size => size > 0)
            ),
            obs.pipe(count()),
            obs.pipe(reduce((accumulated, event) => accumulated + event.cost, 0)),
            obs.pipe(
                map(event => event.cost),
                max()
            ),
            obs.pipe(
                map(event => event.cost),
                min()
            ),
            (size, count, sum, max, min) => ({size, count, sum, max, min})
        ).subscribe(res => console.log(res));

        this.contractSubject = new Rx.Subject();
        this.contractSubject.pipe(
            map(event => this.saveToLog(event)),
            groupBy(event => event.contract.length)
        ).subscribe(obs => countOperator(obs));

        this.userSubject = new Rx.Subject();
        this.userSubject.pipe(
            groupBy(event => event.role.length)
        ).subscribe(obs => countOperator(obs));
    }

    saveToLog(event) {
        //this.getNetworkedTopic()[log].push(event);
        return event;
    }
}