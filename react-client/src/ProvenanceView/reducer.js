import * as modelActions from "../modelActions";
import * as actions from "./actions";
import { ofType, combineEpics } from "redux-observable";
import { withWeb3ContractFrom, withContentFromIDArray } from "../operators";
import UriMap from "../models/maps/UriMap";
import { map, flatMap, reduce } from "rxjs/operators";
import { from, of } from "rxjs";
import { Uri } from "../models";
import jsPDF from 'jspdf';

export const uriEpic = (action$, state$) => action$.pipe(
    ofType(modelActions.types.contractLoad),
    withWeb3ContractFrom(state$),
    withContentFromIDArray("getUrls", "getUrl"),
    map(({action, result}) => actions.onURILoaded(action.id, result))
);

export const provenancePdfEpic = (action$, state$) => action$.pipe(
    ofType(actions.types.createProvPdf),
    withWeb3ContractFrom(state$),
    flatMap(({action, web3Instance}) => {
        return from(
            web3Instance.methods.getProvenanceRecords(Uri.getTitle(action.uri)).call()
        ).pipe(
            flatMap(res => {
                return from(new Array(res).map((value, key) => key));
            }),
            flatMap(index => {
                return from(
                    web3Instance.methods.getProvenanceRecord(
                        Uri.getTitle(action.uri), index
                    ).call()
                )
            }),
            reduce((records, record) => {
                records.push(record+record);
                records.push(record+record);
                return records;
            }, []),
            map(records => {
                let doc = new jsPDF();
                doc.setFont("times");
                doc.text(records,10,10);
                doc.save("provenance.pdf")
                //todo-sv: merge this with other nop
                return {type: "nop"};
            })
        )
    }),
);

export const epic = combineEpics(uriEpic, provenancePdfEpic);

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