import * as actions from "./actions";
import { ofType, combineEpics } from "redux-observable";
import { map, withLatestFrom } from 'rxjs/operators';
import Web3 from 'web3';
import SimpleProvenanceContract from "ProvNet/build/contracts/SimpleProvenanceContract";
//import contract from "truffle-contract";

const searchAddressEpic = (action$, state$) => action$.pipe(
    ofType(actions.types.searchAddress),
    withLatestFrom(state$),
    map(([action, state]) => {
        //truffle-contract based integration
        // var MySimple = contract(SimpleProvenanceContract);
        // MySimple.setProvider(state.web3.currentProvider);
        // var mySimple = MySimple.at(action.address);
        // mySimple.getLinkType.call(1).then(
        //     result => {
        //         console.log("HI2");
        //         console.log(result);
        //     }
        // );

        var web3Instance = new state.web3.eth.Contract(SimpleProvenanceContract.abi, action.address);

        console.log(web3Instance);

        web3Instance.methods.getLinkType(1).call().then(
            result => {
                console.log("HI WEB3");
                console.log(result);
            }
        );
        return {type: "SELECTED_CHANGED", instance: web3Instance};
    })
);

export const epic = combineEpics(
    searchAddressEpic,
);

export const reducer = (state={activeItem: ""}, action) => {
    switch(action.type) {
        case "TOP_MENU_SELECT":
            return Object.assign({}, state, {
                activeItem: action.name,
            });
        default:
            return state;
    }
}

export const selected = (state=null, action) => {
    switch(action.type) {
        case "SELECTED_CHANGED":
            return action.instance;
        default:
            return state;
    }
}