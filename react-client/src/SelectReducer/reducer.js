import * as modelActions from "../modelActions";
import { ofType, combineEpics } from "redux-observable";
import { map, withLatestFrom, flatMap, filter } from 'rxjs/operators';
import { of } from 'rxjs';
import { SelectSelector, Select } from "../models";
import { push } from 'connected-react-router';

const selectContractEpic = (action$) => action$.pipe(
    ofType(modelActions.types.contractSelect, modelActions.types.contractSelectInit),
    filter(action => action.address !== undefined),
    flatMap(action => {
        if(action.type == modelActions.types.contractSelectInit) {
            return of(
                modelActions.onContractLoad(action.address),
            );
        }

        return of(
            modelActions.onContractLoad(action.address),
            push("/ProvNet/contracts/"+action.address)//todo-sv: this url string should not be all over the place =_=
        );
    }),
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
        case modelActions.types.contractSelectInit:
        case modelActions.types.contractSelectHistory:
        case modelActions.types.contractSelect:
            return state.setSelected(action.address);
        case modelActions.types.linkSelected:
            return state.setLinkSelected(action.address);
        default:
            return state;
    }
}