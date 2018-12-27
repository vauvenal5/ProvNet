import React from 'react';
import * as modelActions from "../modelActions";
import * as actions from "./actions";
import { ofType, combineEpics } from "redux-observable";
import { withWeb3ContractFrom, withContentFromIDArray } from "../operators";
import UriMap from "../models/maps/UriMap";
import { map, flatMap, reduce, filter } from "rxjs/operators";
import { from, of } from "rxjs";
import { Uri, ProvRecordsMap } from "../models";
import { editModelActions } from '../EditViews';

export const uriEpic = (action$, state$) => action$.pipe(
    ofType(modelActions.types.contractLoad),
    withWeb3ContractFrom(state$),
    withContentFromIDArray("getUrls", "getUrl"),
    map(({result}) => actions.onURILoaded(result[0], result[1]))
);

export const showProvenanceEpic = (action$) => action$.pipe(
    ofType(actions.types.showProvRecords),
    filter(action => action.address !== undefined),
    filter(action => action.uri !== undefined && action.uri !== null),
    flatMap(action => {

        if(!action.loaded) {
            return of(
                editModelActions.onProvRecordsOpen(true, action.address, action.uri),
                editModelActions.onShowProvenance(action.address, action.uri),
                actions.onProvRecordsLoad(action.address, action.uri)
            );
        }

        return of(
            editModelActions.onProvRecordsOpen(true, action.address, action.uri)
        );
    })
);

export const provenancePdfEpic = (action$, state$) => action$.pipe(
    ofType(actions.types.loadProvRecords),
    withWeb3ContractFrom(state$),
    flatMap(({action, web3Instance}) => {
        return from(
            web3Instance.methods.getProvenanceRecords(action.uri).call()
        ).pipe(
            flatMap(res => {
                return from(new Array(res).map((value, key) => key));
            }),
            flatMap(index => {
                return from(
                    web3Instance.methods.getProvenanceRecord(
                        action.uri, index
                    ).call()
                )
            }),
            reduce((records, record) => {
                records.push(record);
                return records;
            }, []),
            flatMap(records => {
                return of(
                    actions.onProvRecordsLoaded(action.uri, records),
                    editModelActions.onEditSuccessNoClear(action.address, action.uri)
                );
            })
        )
    }),
);

export const epic = combineEpics(uriEpic, showProvenanceEpic, provenancePdfEpic);

export const reducer = (
    state = new UriMap(),
    action
) => {
    switch(action.type) {
        case modelActions.types.contractLoad:
            return UriMap.reset(state);
        case actions.types.uriLoaded:
            return UriMap.add(state, action.uri);
        default:
            return state;
    }
};

export const provRecordReducer = (
    state = new ProvRecordsMap(),
    action
) => {
    switch(action.type) {
        case modelActions.types.contractLoad:
            return state.reset();
        case actions.types.provRecordsLoaded:
            return state.add(action.provRecords);
        default:
            return state;
    }
};