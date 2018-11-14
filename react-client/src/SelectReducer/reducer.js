import * as modelActions from "../modelActions";
import { ofType, combineEpics } from "redux-observable";
import { map, withLatestFrom, flatMap, filter } from 'rxjs/operators';
import { of } from 'rxjs';
import { SelectSelector, Select } from "../models";
import * as editModelActions from "../EditViews/actions";
import * as actions from "./actions";

const selectContractEpic = (action$) => action$.pipe(
    ofType(modelActions.types.contractSelect),
    flatMap(action => of(
        modelActions.onContractLoad(action.address)
    )),
);

const contractLoadedEpic = (action$, state$) => action$.pipe(
    ofType(modelActions.types.contractDetailsLoaded),
    withLatestFrom(state$),
    filter(([action, state]) => 
        action.address === SelectSelector.getSelectedContract(state)
    ),
    map(([action]) => modelActions.onContractSelected(action.address)),
);

const tagSelectEpic = (action$) => action$.pipe(
    ofType(actions.types.tagSelect),
    map(action => editModelActions.onEditModalOpen(action.payload, action.address, action.id))
);

export const epic = combineEpics(
    selectContractEpic,
    contractLoadedEpic,
    tagSelectEpic
);

export const reducer = (state=new Select(), action) => {
    switch(action.type) {
        case modelActions.types.contractSelect:
            return state.setSelected(action.address);
        case modelActions.types.linkSelected:
            return state.setLinkSelected(action.address);
        case actions.types.tagSelect:
            return state.setTagEditModel(action.id);
        default:
            return state;
    }
}