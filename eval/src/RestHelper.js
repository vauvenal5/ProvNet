import * as Rx from "rxjs";
import { 
    flatMap, 
    retry,
    delay,
    map,
    catchError} from "rxjs/operators";
import * as Rp from "request-promise";

class RestHelper{
    /**
     * This function will behave like @postWithPullRetry and retry the post command a total of 3 times on other errors.
     * @param {*} postUrl 
     * @param {*} getPullUrlFunc 
     * @param {*} postBody 
     */
    postRetryWithPullRetry(postUrl, getPullUrlFunc, postBody) {
        return Rx.of(postUrl).pipe(
            flatMap(url => this.postWithPullRetry(postUrl, getPullUrlFunc, postBody)),
            retry(3)
        );
    }

    /**
     * This function will post and pull on 404 until result, error different to 404 or timeout.
     * @param {*} postUrl 
     * @param {*} getPullUrlFunc 
     * @param {*} postBody 
     */
    postWithPullRetry(postUrl, getPullUrlFunc, postBody) {
        return Rx.from(
            Rp.post(postUrl, {
                body: postBody,
                json: true
            })
        ).pipe(
            delay(1000),
            flatMap(resp => this.get(getPullUrlFunc(resp)).pipe(
                catchError(err => {
                    //retry on 404 since prov is not ready
                    if(err.statusCode == 404) {
                        return Rx.throwError(err);
                    }
                    //die on other errors
                    return Rx.of(err);
                })
            )),
            retry(3600),
            flatMap(err => {
                //re-throw server errors
                if(err.error) {
                    return Rx.throwError(err);
                }
                //return normal outputs
                return Rx.of(err);
            })
        );
    }

    /**
     * Deprecated: This function was used for the original deployment to Ropsten.
     * @param {*} postUrl 
     * @param {*} pullUrl 
     * @param {*} postBody 
     */
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