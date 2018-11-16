import * as modelActions from "../modelActions";
import * as actions from "./actions";
import { combineEpics, ofType } from "redux-observable";
import {withWeb3ContractFrom} from "../operators";
import { map, flatMap, switchAll } from "rxjs/operators";
import { from } from 'rxjs';
import { UserSelector, SpecialRoleSelector } from "../models";
import SpecialRolesMap from "./SpecialRolesMap";
import UsersMap from "../models/maps/UsersMap";

export const contractSpecialRolesLoadEpic = (action$, state$) => action$.pipe(
    ofType(modelActions.types.contractLoad),
    withWeb3ContractFrom(state$),
    flatMap(({action, web3Instance}) => {
        return from(
            web3Instance.methods.getSpecialRoles().call()
        ).pipe(
            switchAll(),
            flatMap(role => {
                return from(
                    web3Instance.methods.getSpecialRole(role).call()
                )
            }),
            map(role => modelActions.onUserSpecialRoleLoaded(action.address, role[0], role[1]))
        )
    }),
);

export const usersEpic = (action$, state$) => action$.pipe(
    ofType(modelActions.types.contractLoad),
    withWeb3ContractFrom(state$),
    flatMap(({action, web3Instance}) => {
        return from(
            web3Instance.methods.getUsers().call()
        ).pipe(
            switchAll(),
            flatMap(user => {
                return from(
                    web3Instance.methods.getUser(user).call()
                )
            }),
            map(user => actions.onUserLoaded(user[0], user[1].filter(tag => tag != 0), user[2].filter(tag => tag != 0), user[3]))
        )
    })
);

const epic = combineEpics(contractSpecialRolesLoadEpic, usersEpic);

export const specialRolesReducer = (
    state = new SpecialRolesMap(SpecialRoleSelector.key),
    action
) => {
    switch(action.type) {
        case modelActions.types.contractLoad:
            return SpecialRolesMap.reset(state);
        case modelActions.types.userSpecialRoleLoaded:
            return SpecialRolesMap.add(state, action.role);
        default:
            return state;
    }
};

export const usersReducer = (
    state = new UsersMap(UserSelector.key), 
    action
) => {
    switch(action.type) {
        case modelActions.types.contractLoad:
            return UsersMap.reset(state);
        case actions.types.userLoaded:
            return UsersMap.add(state, action.user);
        default:
            return state;
    }
}

export default {specialRolesReducer, usersReducer, epic};