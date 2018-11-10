import * as modelActions from "../modelActions";
import * as actions from "./actions";
import { combineEpics, ofType } from "redux-observable";
import {withWeb3ContractFrom} from "../operators";
import { map, flatMap, switchAll } from "rxjs/operators";
import { from } from 'rxjs';
import MapModel from "../models/MapModel";
import { User, Tag } from "../models";

export const contractSpecialRolesLoadEpic = (action$, state$) => action$.pipe(
    ofType(modelActions.types.contractLoad),
    withWeb3ContractFrom(state$),
    flatMap(([action, web3Instance]) => {
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
    flatMap(([action, web3Instance]) => {
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

export const specialRolesReducer = (state = new MapModel("specialRoles", (item) => Tag.getId(item)), action) => {
    switch(action.type) {
        case modelActions.types.contractLoad:
            return MapModel.reset(state);
        case modelActions.types.userSpecialRoleLoaded:
            return MapModel.add(state, action.role);
        default:
            return state;
    }
};

export const usersReducer = (state = new MapModel("users", User.getAddress), action) => {
    switch(action.type) {
        case modelActions.types.contractLoad:
            return MapModel.reset(state);
        case actions.types.userLoaded:
            return MapModel.add(state, action.user);
        default:
            return state;
    }
}

export const root = "specialRoles";

export default {root, specialRolesReducer, usersReducer, epic};