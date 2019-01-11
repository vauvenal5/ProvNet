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

export default class CostCounter {
    constructor(groupFunc) {

        let minOperation = (obs, minMap) => obs.pipe(
            map(e => minMap(e)),
            min()
        );

        let maxOperation = (obs, maxMap) => obs.pipe(
            map(e => maxMap(e)),
            max()
        );

        let sumOperator = (obs, sumMap) => obs.pipe(
            map(e => sumMap(e)),
            reduce((sum, cost) => sum + cost, 0)
        )

        let nameOperator = (obs) => obs.pipe(
            map(event => event.event),
            first(event => true)
        );

        let countOperator = (obs, groupFunc) => Rx.zip(
            nameOperator(obs).pipe(
                map(op => op+"-Stats")
            ),
            obs.pipe(
                map(event => groupFunc(event)),
                first(size => size > 0)
            ),
            obs.pipe(count()),
            minOperation(obs, e => e.cost),
            maxOperation(obs, e => e.cost),
            sumOperator(obs, e => e.cost),
            (event, size, count, min, max, sum) => ({event, size, count, min, max, sum})
        );

        let totalOperator = (obs) => Rx.zip(
            nameOperator(obs).pipe(
                map(op => op+"-Total")
            ),
            Rx.zip(
                minOperation(obs, e => e.size),
                maxOperation(obs, e => e.size),
                (min, max) => min+"-"+max
            ),
            sumOperator(obs, e => e.count),
            minOperation(obs, e => e.min),
            maxOperation(obs, e => e.max),
            sumOperator(obs, e => e.sum),
            (event, size, count, min, max, sum) => ({event, size, count, min, max, sum})
        );

        this.subject = new Rx.Subject().pipe(
            groupBy(event => groupFunc(event)),
            flatMap(obs => countOperator(obs, groupFunc))
        );

        this.subject.subscribe(res => console.log(res));

        totalOperator(this.subject).subscribe(total => console.log(total));
    }

    next(event) {
        this.subject.next(event);
    }

    complete() {
        this.subject.complete();
    }
}