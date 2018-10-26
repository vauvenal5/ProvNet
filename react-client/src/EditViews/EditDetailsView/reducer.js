import * as actions from "./actions";
import { withLatestFrom, flatMap, map, catchError } from "rxjs/operators";
import { ofType, combineEpics } from "redux-observable";
import SimpleProvenanceContract from "ProvNet/build/linked/SimpleProvenanceContract";
import { from, of, forkJoin, Observable, iif, defer, empty } from "rxjs";
import { ContractDetails, ProvContract, ProvContractList, modelActions, EditModalLeaf, EditModalList, accountsPromiseFactory } from "./imports";

export const editDetailEpic = (action$, state$) => action$.pipe(
    ofType(actions.types.editDetails),
    withLatestFrom(state$),
    flatMap(([action, state]) => {
        let web3Instance = new state.web3.eth.Contract(SimpleProvenanceContract.truffle.abi, action.address);
        let currentDetails = ProvContract.getDetails(ProvContractList.getSelectedContract(ProvContractList.getSelf(state)));

        return from(
            accountsPromiseFactory(state.web3)
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

        const detailObsFactory = (detail, currDetail, web3ObsFac) => {
            if(detail.localeCompare(currDetail) == 0) {
                return of({noChange: true});
            }

            return web3ObsFac(detail);
        }
        
        return forkJoin (
            defer(() => detailObsFactory(
                ContractDetails.getTitle(action.details), 
                ContractDetails.getTitle(currentDetails), 
                (detail) => web3Instance.methods.setTitle(detail).send({from: account})
            )),
            defer(() => detailObsFactory(
                ContractDetails.getDescription(action.details), 
                ContractDetails.getDescription(currentDetails), 
                (detail) => web3Instance.methods.setDescription(detail).send({from: account})
            )),
            defer(() => detailObsFactory(
                ContractDetails.getLogoUrl(action.details), 
                ContractDetails.getLogoUrl(currentDetails), 
                (detail) => web3Instance.methods.setLogoUrl(detail).send({from: account})
            ))
        ).pipe(
            map(([resTitle, resDesc, resUrl]) => {
                if(resTitle.noChange && resDesc.noChange && resUrl.noChange) {
                    return actions.onNop();
                }

                return modelActions.onContractDetailsLoaded(
                    action.address, 
                    ContractDetails.getTitle(action.details),
                    ContractDetails.getDescription(action.details),
                    ContractDetails.getLogoUrl(action.details)
                );
            }),
            catchError(err => {
                console.log(err);
            })
        )
    })
);

export const epic = combineEpics(editDetailEpic);

export const reducer = (state = new EditModalList("details"), action) => {
    switch(action.type) {
        case actions.types.editDetails:
            let leaf = EditModalLeaf.setLoading(EditModalList.getModal(state, action.address))
            return EditModalList.setModal(state, leaf);
        case modelActions.types.editDetailsModalOpen:
            if(action.value) {
                state = EditModalList.putOnce(state, new EditModalLeaf(action.address));
            }
            return EditModalList.setOpen(state, action.value);
        default:
            return state;
    }
}