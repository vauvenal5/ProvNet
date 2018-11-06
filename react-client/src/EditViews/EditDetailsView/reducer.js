import * as actions from "./actions";
import { withLatestFrom, flatMap, map, catchError, mapTo, delay } from "rxjs/operators";
import { ofType, combineEpics } from "redux-observable";
import SimpleProvenanceContract from "ProvNet/build/linked/SimpleProvenanceContract";
import { from, of, forkJoin, Observable, iif, defer, empty } from "rxjs";
import { ContractDetails, ProvContract, ProvContractList, modelActions, EditModalLeaf, EditModalList, MetaMaskPromiseFactory } from "./imports";

export const editDetailEpic = (action$, state$) => action$.pipe(
    ofType(actions.types.editDetails),
    withLatestFrom(state$),
    flatMap(([action, state]) => {
        let web3Instance = new state.web3.eth.Contract(SimpleProvenanceContract.truffle.abi, action.address);
        let currentDetails = ProvContract.getDetails(ProvContractList.getSelectedContract(ProvContractList.getSelf(state)));

        return from(
            MetaMaskPromiseFactory.accountsPromise(state.web3)
        ).pipe(
            map((accounts) => ({
                web3Instance,
                account: accounts[0],
                action,
                currentDetails
            }))
        )
    }),
    flatMap(({web3Instance, account, action, currentDetails}) => {

        const detailObsFactory = (getter, web3Func) => {
            let detail = getter(action.details);
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
                    return of(actions.onEditDetailsModalClear(action.address));
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
                        checkRes(resTitle, action.details, currentDetails, ContractDetails.getTitle),
                        checkRes(resDesc, action.details, currentDetails, ContractDetails.getDescription),
                        checkRes(resUrl, action.details, currentDetails, ContractDetails.getLogoUrl)
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

export const editDetailSuccessEpic = (action$) => action$.pipe(
    ofType(actions.types.editDetailsSuccess),
    delay(1000),
    map(action => actions.onEditDetailsModalClear(action.address))
);

export const epic = combineEpics(editDetailEpic, editDetailSuccessEpic);

export const reducer = (state = new EditModalList("details"), action) => {
    let leaf = EditModalList.getModal(state, action.address);
    switch(action.type) {
        case actions.types.editDetails:
            return EditModalList.setModal(state, EditModalLeaf.setLoading(leaf));
        case modelActions.types.editDetailsModalOpen:
            if(action.value) {
                state = EditModalList.putOnce(state, new EditModalLeaf(action.address));
            }
            return EditModalList.setOpen(state, action.value);
        case actions.types.editDetailsError:
            return EditModalList.setModal(state, EditModalLeaf.setError(leaf, action.error));
        case actions.types.editDetailsSuccess:
            return EditModalList.setModal(state, EditModalLeaf.setSuccess(leaf));
        case actions.types.editDetailsModalClear:
            return EditModalList.setModal(state, EditModalLeaf.setCleared(leaf));
        default:
            return state;
    }
}