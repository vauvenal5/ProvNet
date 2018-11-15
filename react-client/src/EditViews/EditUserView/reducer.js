import { ofType, combineEpics } from "redux-observable";
import * as actions from "../actions";
import { withWeb3ContractFrom, withAccountInfo } from "../../operators";
import { flatMap, map, catchError } from "rxjs/operators";
import { defer, of } from "rxjs";
import { detailObsFactory } from "../detailObsFactory";
import * as userActions from "../../UsersView/actions";
import EditModelSelector from "../../models/selectors/EditModelSelector";

export const addUserEpic = (action$, state$) => action$.pipe(
    ofType(actions.types.addUser),
    withWeb3ContractFrom(state$),
    withAccountInfo(),
    flatMap(({action, account, web3Instance}) => {
        return defer(() => detailObsFactory(
            action.payload.user,
            action.payload.origUser,
            () => web3Instance.methods.addUserTmp(action.payload.user).send({from: account})
        )).pipe(
            flatMap(res => {
                if(res.noChange) {
                    return of(actions.onEditModalClear(action.address, EditModelSelector.userKey));
                }

                return of(
                    userActions.onUserLoaded(action.payload.user),
                    actions.onEditSuccess(action.address, EditModelSelector.userKey)
                );
            }),
            catchError(err => {
                console.log(err);
                return of(actions.onEditError(action.address, EditModelSelector.userKey, {
                    msg: "Could not add user to contract!",
                    header: "User add error",
                }));
            })
        )
    })
);

export const epic = combineEpics(addUserEpic);