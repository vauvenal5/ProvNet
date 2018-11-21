import { ofType, combineEpics } from "redux-observable";
import * as actions from "../actions";
import { withWeb3ContractFrom, withAccountInfo } from "../../operators";
import { flatMap, map, catchError } from "rxjs/operators";
import { defer, of } from "rxjs";
import { detailObsFactory, arrayObsRecFactory } from "../detailObsFactory";
import * as userActions from "../../UsersView/actions";
import EditModelSelector from "../../models/selectors/EditModelSelector";
import { User } from "../../models";
import * as selectActions from "../../SelectReducer/actions";

export const reselctEpic = (actions$) => actions$.pipe(
    ofType(actions.types.reselect),
    flatMap(action => {
        return of(
            actions.onEditModalOpen(false, action.address, action.current),
            actions.onEditModalClear(action.address, action.current),
            //todo-sv: this is wrong, currently this epic gets triggered by addUser and addLink component
            selectActions.onEditUserSelect(action.address, action.id, true)
        );
    })
);

export const addUserEpic = (action$, state$) => action$.pipe(
    ofType(actions.types.addUser),
    withWeb3ContractFrom(state$),
    withAccountInfo(),
    flatMap(({action, account, web3Instance}) => {

        let user = action.payload.user;
        let origUser = action.payload.origUser;

        let removedSpecial = User.getSpecialRoles(origUser).filter(role => !User.hasSpecialRole(user, role));
        let addedSpecial = User.getSpecialRoles(user).filter(role => !User.hasSpecialRole(origUser, role));
        let removedLink = User.getRoles(origUser).filter(role => !User.hasRole(user, role));
        let addedLink = User.getRoles(user).filter(role => !User.hasRole(origUser, role));

        let web3ObsFactory = () => web3Instance.methods.changeUser(
            User.getAddress(user), 
            addedSpecial, removedSpecial,
            addedLink, removedLink
        ).send({from: account});

        return defer(() => arrayObsRecFactory(
            removedSpecial,
            () => arrayObsRecFactory(
                addedSpecial,
                () => arrayObsRecFactory(
                    removedLink,
                    () => arrayObsRecFactory(
                        addedLink,
                        () => detailObsFactory(
                            User.getAddress(user),
                            User.getAddress(origUser),
                            web3ObsFactory
                        ),
                        web3ObsFactory
                    ),
                    web3ObsFactory
                ),
                web3ObsFactory
            ),
            web3ObsFactory
        )).pipe(
            flatMap(res => {
                if(res.noChange) {
                    return of(actions.onEditModalClear(action.address, EditModelSelector.userKey));
                }

                return of(
                    userActions.onUserLoaded(
                        User.getAddress(user),
                        User.getSpecialRoles(user),
                        User.getRoles(user),
                        User.isOwner(user)
                    ),
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

export const epic = combineEpics(addUserEpic, reselctEpic);