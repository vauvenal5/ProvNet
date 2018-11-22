import * as modelActions from "../modelActions";
import { ofType, combineEpics } from "redux-observable";
import { map, withLatestFrom, flatMap, filter } from 'rxjs/operators';
import { of } from 'rxjs';
import { SelectSelector, Select } from "../models";

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

export const epic = combineEpics(
    selectContractEpic,
    contractLoadedEpic,
);

export const reducer = (state=new Select(), action) => {
    switch(action.type) {
        case modelActions.types.contractSelect:
            return state.setSelected(action.address);
        case modelActions.types.linkSelected:
            return state.setLinkSelected(action.address);
        default:
            return state;
    }
}