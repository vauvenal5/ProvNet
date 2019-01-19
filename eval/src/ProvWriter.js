import * as Rx from "rxjs";
import { flatMap, filter, map, concatMap, repeat, reduce, catchError, subscribeOn, retry } from "rxjs/operators";
import * as Rp from "request-promise";
import restHelper from "./RestHelper";
import PersistableHelper from "./PersistableHelper";

export default class ProvWriter extends PersistableHelper {
    constructor(provUrl, size, network, persist) {
        super(network, persist, "provcost", e => e.size, e => this.getKey(e.size,e.nr))
        this.provUrl = provUrl;
        this.size = size;
        this.nrs = {};
    }

    getKey(size, nr) {
        return size+":"+nr;
    }

    saveProv(contract, prov, size=this.size) {

        if(this.nrs[size] === undefined) {
            this.nrs[size] = 0;
        } else {
            this.nrs[size] = this.nrs[size] + 1;
        }

        let existing = this.getNetworkedTopic()[this.getKey(size, this.nrs[size])];

        if(existing !== undefined) {
            //console.log("Prov result exists. Skipping...");
            this.addEventNoLog(existing);
            return Rx.of(existing);
        }

        return restHelper.postWithPullRetry(
            "http://localhost:3001/contracts/"+contract,
            (resp) => "http://localhost:3001/contracts/"+contract+"/"+resp.uuid,
            {
                url: "https://github.com/vauvenal5/ProvNet-"+this.provUrl,
                prov: `${prov}`
            }
        ).pipe(
            catchError(err => {
                if((err.message+"").indexOf("out of gas") > 0
                || (err.message+"").indexOf("gas required exceeds allowance") > 0) {
                    return Rx.of({
                        gasUsed: 8000000
                    });
                }

                return Rx.throwError(err);
            }),
            retry(3),
            map(receipt => {
                

                let out = ({size, nr: this.nrs[size], cost: receipt.gasUsed});

                this.addEventNoLog(out);

                return out;
            })
        );
    }

    measureProv(contract, line) {
        return Rx.range(0, 8).pipe(
            map(power => Math.pow(2, power)),
            concatMap(times => Rx.of(line, Rx.queueScheduler).pipe(
                repeat(times),
                reduce((lines, line) => lines+line, ""),
                concatMap(prov => this.saveProv(contract, prov, this.size*times)),
            )),
        );
    }

    measureProvIot(contract, line) {
        return Rx.range(0, 8).pipe(
            map(power => Math.pow(2, power)),
            concatMap(times => Rx.of(line, Rx.queueScheduler).pipe(
                repeat(times),
                concatMap(prov => this.saveProv(contract, prov)),
                reduce((total, e) => {
                    total.count++;
                    total.cost += e.cost;
                    return total;
                }, ({size: this.size*times, count: 0, cost: 0}))
                // reduce((cost, receipt) => cost+receipt.gasUsed, 0),
                // map(cost => {
                //     let out = ({times, receipt: {gasUsed: cost}});
                //     this.addEvent(out);
                //     return out;
                // })
            )),
        );
    }
}