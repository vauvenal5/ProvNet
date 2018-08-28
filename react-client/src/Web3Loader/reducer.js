import { filter, delay, map, withLatestFrom } from 'rxjs/operators';
import { combineEpics, ofType } from 'redux-observable';
import Web3 from 'web3';
import * as actions from "./actions";

const web3LoaderEpic = (action$, state$) => action$.pipe(
    ofType(actions.types.initWeb3),
    withLatestFrom(state$),
    filter(([, state]) => state.web3 === null),
    delay(1000),//this is only for estetics
    map(() => {
        if(window.web3 === undefined) {
            return actions.initFailed("No metamask found!");
        }
        return actions.initSuccess(new Web3(window.web3.currentProvider));
    })
);

export const epic = combineEpics(
    web3LoaderEpic,
);

export const reducer = (state={web3: undefined, active: true, failed: false}, action) => {
    switch(action.type) {
        case actions.types.initWeb3Success:
            return Object.assign({}, state, {
                active: false,
                failed: false
            });
        case actions.types.initWeb3Failed:
            return Object.assign({}, state, {
                active: false,
                failed: true
            });
        //todo-sv: add error handling
        default:
            return state;
    }
}

export const web3 = (state=null, action) => {
    switch(action.type) {
        case actions.types.initWeb3Success:
            return action.web3;
        default:
            return state;
    }
}