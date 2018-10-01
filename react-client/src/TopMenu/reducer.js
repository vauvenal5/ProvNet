import * as actions from "./actions";
import * as modelActions from "../modelActions";
import { ofType, combineEpics } from "redux-observable";
import { map, withLatestFrom, mapTo, filter } from 'rxjs/operators';
import Web3 from 'web3';
import SimpleProvenanceContract from "ProvNet/build/contracts/SimpleProvenanceContract";
//import contract from "truffle-contract";

const searchAddressEpic = (action$) => action$.pipe(
    ofType(actions.types.searchAddress),
    map(action => modelActions.onContractLoad(action.address)),
);

const contractLoadedEpic = (action$, state$) => action$.pipe(
    ofType(modelActions.types.contractLoadSuccess),
    withLatestFrom(state$),
    filter(([action, state]) => 
        action.contract.address === state.topMenu.address
    ),
    map(([action]) => modelActions.onContractSelect(action.contract.address)),
)

export const epic = combineEpics(
    searchAddressEpic,
    contractLoadedEpic,
);

export const reducer = (state={activeItem: ""}, action) => {
    switch(action.type) {
        case "TOP_MENU_SELECT":
            return Object.assign({}, state, {
                activeItem: action.name,
            });
        case actions.types.searchAddress:
            return Object.assign({}, state, {
                address: action.address,
            });
        default:
            return state;
    }
}

// export const selected = (state=null, action) => {
//     switch(action.type) {
//         case "SELECTED_CHANGED":
//             return action.instance;
//         default:
//             return state;
//     }
// }