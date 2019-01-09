import * as Rx from "rxjs";
import { 
    map,
    filter,
    concatMap,
    flatMap,
    switchAll,
    reduce,
    first,
    find} from "rxjs/operators";
import web3Provider from "../web3Provider";
import links from "../links";
import types from "../types";

export const controller = {};

controller.bfs = (searched = {}, address, url, validLinks=[]) => Rx.of(address).pipe(
    map(add => {
        console.log("BFS called with: " + add);
        searched[add] = "processing";
        return add;
    }),
    web3Provider.simpleProvenanceContractOperator(),
    concatMap(web3Contract => {
        return Rx.zip(
            Rx.from(
                web3Contract.methods.getProvenanceRecords(url).call()
            ),
            Rx.from(web3Contract.methods.getTitle().call()),
            links.observables.linksLoadObservable(web3Contract),
            types.observables.typesLoadObservable(web3Contract).pipe(
                switchAll(),
                reduce((tags, tag) => {
                    tags[tag.id] = tag.type;
                    return tags;
                }, {})
            ),
            (recordsLength, title, links, tags) => {
                searched[address] = title;
                return ({recordsLength, links, tags});
            }
        ).pipe(
            concatMap(({recordsLength, links, tags}) => Rx.from(links).pipe(
                concatMap(link => Rx.from(link.tags).pipe(
                    map(tag => tags[tag]),
                    reduce((tags, tag) => {
                        tags.push(tag);
                        return tags;
                    }, []),
                    map(tags => {
                        link.tags = tags;
                        link.address = link.address.toLowerCase();
                        return link;
                    })
                )),
                reduce((links, link) => {
                    links.push(link);
                    return links;
                }, []),
                map(links => ({recordsLength, links}))
            )),
            concatMap(({recordsLength, links}) => {
                return Rx.merge(
                    Rx.of(recordsLength).pipe(
                        filter(recordsLength => recordsLength > 0),
                        map(recordsLength => address)
                    ),
                    Rx.from(links).pipe(
                        filter(link => searched[link.address] === undefined),
                        concatMap(link => Rx.from(link.tags).pipe(
                            find(type => validLinks.includes(type)),
                            filter(type => type !== undefined),
                            concatMap(type => controller.bfs(searched, link.address, url, validLinks)),
                        ))
                    )
                );
            })
        );
    }),
);