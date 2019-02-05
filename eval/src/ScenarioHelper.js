import * as Rx from "rxjs";
import { flatMap, filter, map, concatMap, repeat, reduce, catchError, subscribeOn, retry } from "rxjs/operators";
import restHelper from "./RestHelper";

export default class ScenarioHelper {

    constructor() {
        this.addressMap = {};
        this.addressMap["256"] = "0x239249e1bb5859cb5214555e06dfb08260ee64ae";
        this.addressMap["128"] = "0x82a6f0217348ce9af9ea6d7d54aa41ddda06de3e";
        this.addressMap["64"] = "0x7487d90e1faff5c569ae99b1453adceaabd87c8a";
        this.addressMap["32"] = "0x1747bae0546a80818e974eb81e99c7846099dd12";
        this.addressMap["16"] = "0x330c2646ea6be38625ce3b15957738820b31370a";

        // this.target = encodeURIComponent("http://thesis.eval/scenario1");
        // this.weights = encodeURIComponent(JSON.stringify(["trusted", "known"]));
        this.target = "http://thesis.eval/scenario1";
        this.weights = ["trusted", "known"];
    }

    runScenario(url, target, weights) {
        let body = {
            target,
            links: weights
        };
        restHelper.postWithPullRetry(url, (resp) => url+"/"+resp.uuid, body).subscribe(res => {
            //let out = JSON.parse(res);
            let out = {request: { url, body }, ...res};
            console.log(JSON.stringify(out, undefined, 4));
        });
    }
    
    measure(size, times) {
        return Rx.of(size).pipe(
            concatMap(size => Rx.of(this.addressMap[size], Rx.queueScheduler).pipe(
                repeat(times),
                concatMap(address => Rx.from(
                    restHelper.postWithPullRetry(
                        "http://localhost:3001/contracts/"+address+"/search",
                        (resp) => "http://localhost:3001/contracts/"+address+"/search/"+resp.uuid, {
                            target: this.target,
                            links: this.weights
                        }
                    )
                    //restHelper.get("http://localhost:3001/contracts/"+address+"/search?target="+this.target+"&links="+this.weights)
                ).pipe(
                    map(res => ({size, cost: res.results.time}))
                ))
            ))
        );
    }
}