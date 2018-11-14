import {MetaMaskPromiseFactory } from "./imports";
import * as actions from "../actions";
import { ofType, combineEpics } from "redux-observable";

import { from, of, defer } from "rxjs";
import { flatMap, map, catchError } from "rxjs/operators";
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

        let tagId = action.id;
        let title = action.payload;

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
                    actions.onEditSuccess(action.address, tagId)
                );
            }),
            catchError(err => {
                console.log(err);
                return of(actions.onEditError(action.address, tagId, {
                    msg: "Could not commit all transactions.",
                    header: "Tag edit error",
                    list: true
                }));
            })
        )
    })
);

// export const editTagSuccessEpic = (action$) => action$.pipe(
//     ofType(actions.types.editSuccess),
//     delay(1000),
//     map(action => actions.onEditModalClear(action.address, action.id))
// );

export const epic = combineEpics(editTagEpic);