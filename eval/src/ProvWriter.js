import * as Rx from "rxjs";
import { flatMap, filter, map } from "rxjs/operators";
import * as Rp from "request-promise";

export default class ProvWriter{
    constructor() {

    }

    test(contract, line, lineNr) {
        Rx.from(
            Rp.put("http://localhost:3001/contracts/"+contract, {
                body: {
                    url: "https://github.com/vauvenal5/ProvNet"+lineNr,
                    prov: `${line}`
                },    
                json: true
            })
        ).subscribe(res => console.log(res));
    }
}