import * as actions from "./actions";
import * as modelActions from "../modelActions";
import { ofType, combineEpics } from "redux-observable";
import { map, withLatestFrom, flatMap, filter } from 'rxjs/operators';
import { of } from 'rxjs';

const searchAddressEpic = (action$) => action$.pipe(
    ofType(actions.types.searchAddress),
    //todo-sv: check if contract exists
    flatMap(action => of(
        modelActions.onContractLoad(action.address)
    )),
);

const contractLoadedEpic = (action$, state$) => action$.pipe(
    ofType(modelActions.types.contractDetailsLoaded),
    withLatestFrom(state$),
    filter(([action, state]) => 
        action.address === state.topMenu.address
    ),
    map(([action]) => modelActions.onContractSelect(action.address)),
)

export const epic = combineEpics(
    searchAddressEpic,
    contractLoadedEpic,
);

export const reducer = (state={activeItem: ""}, action) => {
    switch(action.type) {
        case actions.types.searchAddress:
            return Object.assign({}, state, {
                address: action.address,
            });
        default:
            return state;
    }
}