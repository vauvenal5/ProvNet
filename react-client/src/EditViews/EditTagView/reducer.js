import {EditModalLeaf, MetaMaskPromiseFactory } from "./imports";
import * as actions from "./actions";
import EditModalTagList from "./EditModalTagList";
import { ofType, combineEpics } from "redux-observable";

import { from, of, defer } from "rxjs";
import { flatMap, map, catchError, delay } from "rxjs/operators";
import { modelActions } from "../imports";
import { withWeb3ContractFrom } from "../../operators";

export const editTagEpic = (action$, state$) => action$.pipe(
    ofType(actions.types.editTag),
    withWeb3ContractFrom(state$),
    flatMap(([action, web3Instance, web3]) => {
        return from(
            MetaMaskPromiseFactory.accountsPromise(web3)
        ).pipe(
            map((accounts) => ({
                web3Instance,
                account: accounts[0],
                action
            }))
        )
    }),
    flatMap(({web3Instance, account, action}) => {
        const detailObsFactory = (detail, currDetail, web3ObsFac) => {
            if(detail.localeCompare(currDetail) == 0) {
                return of({noChange: true});
            }

            return web3ObsFac(detail);
        }

        let {tagId, title} = action;

        return defer(() => detailObsFactory(
            title,
            action.origTitle,
            (title) => web3Instance.methods.setTagTitle(tagId, title).send({from: account})
        )).pipe(
            flatMap(res => {
                if(res.noChange) {
                    return actions.onNop();
                }

                return of( 
                    modelActions.onTypeLoaded(action.address, tagId, title),
                    actions.onEditTagSuccess(action.address, tagId)
                );
            }),
            catchError(err => {
                console.log(err);
                return of(actions.onEditTagError(action.address, tagId, {
                    msg: "Could not commit all transactions.",
                    header: "Tag edit error",
                    list: true
                }));
            })
        )
    })
);

export const editTagSuccessEpic = (action$) => action$.pipe(
    ofType(actions.types.editTagSuccess),
    delay(1000),
    map(action => actions.onEditTagModalClear(action.address, action.tagId))
);

export const epic = combineEpics(editTagEpic, editTagSuccessEpic);

const stateSetHelper = (state, leaf, address, tagId) => {
    state = EditModalTagList.setModal(state, leaf, address);
    return state.setSelected(address, tagId);
}

export const reducer = (
    state = new EditModalTagList(), 
    action ) => {
        let leaf = EditModalTagList.getModal(state, action.address, action.tagId);
        switch(action.type) {
            case actions.types.editTag:
                leaf = EditModalLeaf.setLoading(leaf);
                state = EditModalTagList.setModal(state, leaf, action.address);
                return state.setSelected(action.address, action.tagId);
            case actions.types.editTagModalOpen:
                if(action.value) {
                    state = EditModalTagList.putOnce(state, EditModalTagList.create(action.address, new EditModalLeaf(action.tagId)));
                    state = EditModalTagList.setSelected(state, action.address, action.tagId);
                }
                return state.setOpen(action.value);
            case actions.types.editTagError:
                leaf = EditModalLeaf.setError(leaf, action.error);
                return stateSetHelper(state, leaf, action.address, action.tagId);
            case actions.types.editTagSuccess:
                leaf = EditModalLeaf.setSuccess(leaf);
                return stateSetHelper(state, leaf, action.address, action.tagId);
            case actions.types.editTagModalClear:
                leaf = EditModalLeaf.setCleared(leaf);
                return stateSetHelper(state, leaf, action.address, action.tagId);
            default:
                return state;
        }
}