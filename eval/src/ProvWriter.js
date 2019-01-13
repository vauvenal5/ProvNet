import * as Rx from "rxjs";
import { flatMap, filter, map, concatMap, repeat, reduce, catchError, subscribeOn } from "rxjs/operators";
import * as Rp from "request-promise";

export default class ProvWriter{
    constructor(provUrl) {
        this.provUrl = provUrl;
    }

    saveProv(contract, prov) {
        return Rx.from(
            Rp.put("http://localhost:3001/contracts/"+contract, {
                body: {
                    url: "https://github.com/vauvenal5/ProvNet-"+this.provUrl,
                    prov: `${prov}`
                },    
                json: true
            })
        ).pipe(
            catchError(err => {
                if((err.error+"").indexOf("out of gas")) {
                    return Rx.of({
                        gasUsed: "outOfGas"
                    });
                }

                return Rx.of(err);
            })
        );
    }

    measureProv(contract, line) {
        return Rx.range(0, 8).pipe(
            map(power => Math.pow(2, power)),
            concatMap(times => Rx.of(line, Rx.queueScheduler).pipe(
                repeat(times),
                reduce((lines, line) => lines+line, ""),
                concatMap(prov => this.saveProv(contract, prov)),
                map(receipt => ({times, receipt}))
            )),
        );
    }

    measureProvIot(contract, line) {
        return Rx.range(0, 8).pipe(
            map(power => Math.pow(2, power)),
            concatMap(times => Rx.of(line, Rx.queueScheduler).pipe(
                repeat(times),
                concatMap(prov => this.saveProv(contract, prov)),
                reduce((cost, receipt) => cost+receipt.gasUsed, 0),
                map(cost => ({times, receipt: {gasUsed: cost}}))
            )),
        );
    }
}