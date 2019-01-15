import * as Rx from "rxjs";
import { 
    flatMap, 
    retry,
    delay} from "rxjs/operators";
import * as Rp from "request-promise";

class RestHelper{
    postAndPull(postUrl, pullUrl, postBody) {
        return Rx.from(
            Rp.post(postUrl, {
                body: postBody,
                json: true
            })
        ).pipe(
            delay(10000),
            flatMap(resp => this.get(pullUrl)),
            retry(3600)
        );
    }

    get(url) {
        return Rx.from(
            Rp.get(url, {json: true})
        );
    }
}

let restHelper = new RestHelper();
export default restHelper;