import * as actions from "../actions";
import { withLatestFrom, flatMap, map, catchError, mapTo, delay } from "rxjs/operators";
import { ofType, combineEpics } from "redux-observable";
import { from, of, forkJoin, Observable, iif, defer, empty } from "rxjs";
import { ContractDetails, modelActions, MetaMaskPromiseFactory } from "./imports";
import { withWeb3ContractFrom } from "../../operators";
import EditModelSelector from "../../models/selectors/EditModelSelector";

export const editDetailEpic = (action$, state$) => action$.pipe(
    ofType(actions.types.editDetails),
    withWeb3ContractFrom(state$),
    flatMap(({action, web3Instance, web3}) => {
        return from(
            MetaMaskPromiseFactory.accountsPromise(web3)
        ).pipe(
            map((accounts) => ({
                web3Instance,
                account: accounts[0],
                action,
                currentDetails: action.payload.origDetails
            }))
        )
    }),
    flatMap(({web3Instance, account, action, currentDetails}) => {

        const detailObsFactory = (getter, web3Func) => {
            let detail = getter(action.payload.details);
            let currDetail = getter(currentDetails);

            if(detail.localeCompare(currDetail) == 0) {
                return of({noChange: true});
            }

            return from(
                web3Func(detail).send({from: account})
            ).pipe(
                catchError(err => {
                    console.log(err);
                    return of({error: true});
                })
            );
        }
        
        return forkJoin (
            defer(() => detailObsFactory(
                ContractDetails.getTitle,
                web3Instance.methods.setTitle
            )),
            defer(() => detailObsFactory(
                ContractDetails.getDescription,
                web3Instance.methods.setDescription
            )),
            defer(() => detailObsFactory(
                ContractDetails.getLogoUrl,
                web3Instance.methods.setLogoUrl
            ))
        ).pipe(
            flatMap(([resTitle, resDesc, resUrl]) => {
                if(resTitle.noChange && resDesc.noChange && resUrl.noChange) {
                    return of(actions.onEditModalClear(action.address, EditModelSelector.detailsKey));
                }

                const checkRes = (res, details, currentDetails, getter) => {
                    if(res.error) {
                        return getter(currentDetails);
                    }
                    return getter(details);
                };

                let resActions = [];
                resActions.push(modelActions.onContractDetailsLoaded(
                        action.address, 
                        checkRes(resTitle, action.payload.details, currentDetails, ContractDetails.getTitle),
                        checkRes(resDesc, action.payload.details, currentDetails, ContractDetails.getDescription),
                        checkRes(resUrl, action.payload.details, currentDetails, ContractDetails.getLogoUrl)
                    )
                );

                if(resTitle.error || resDesc.error || resUrl.error) {
                    resActions.push(actions.onEditDetailsError(action.address, {
                        msg: "We were not able to transfer some or all of your details.",
                        header: "One or more transactions failed!",
                        list: true
                    }));
                } else {
                    resActions.push(actions.onEditDetailsSuccess(action.address));
                }

                return from(resActions);
            })
        )
    })
);

export const epic = combineEpics(editDetailEpic);