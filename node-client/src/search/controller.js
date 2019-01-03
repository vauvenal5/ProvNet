import * as Rx from "rxjs";
import { 
    map,
    filter,
    concatMap} from "rxjs/operators";
import web3Provider from "../web3Provider";

export const controller = {};

controller.bfs = (searched = [], address, url) => Rx.of(address).pipe(
    map(add => {
        searched.push(add);
        return add;
    }),
    web3Provider.simpleProvenanceContractOperator(),
    concatMap(web3Contract => {
        return Rx.zip(
            Rx.from(
                web3Contract.methods.getProvenanceRecords(url).call()
            ),
            Rx.from(
                web3Contract.methods.getLinkList().call()
            ),
            (recordsLength, links) => ({recordsLength, links})
        );
    }),
    map(value => {
        console.log(value);
        return value;
    }),
    concatMap(({recordsLength, links}) => {
        return Rx.merge(
            Rx.of(recordsLength).pipe(
                filter(recordsLength => recordsLength > 0),
                map(recordsLength => address)
            ),
            Rx.from(links).pipe(
                map(add => add.toLowerCase()),
                filter(add => {
                    console.log(searched);
                    return !searched.includes(add);
                }),
                concatMap(add => controller.bfs(searched, add, url)),
            )
        );
    })
);