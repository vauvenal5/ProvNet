import * as modelActions from "../modelActions";
import * as actions from "./actions";
import ContractDeployment from "../DeployContract/ContractDeployment";
import EditModalList from "../EditModal/EditModalList";
import EditModalLeaf from "../EditModal/EditModalLeaf";
import { withLatestFrom, flatMap, map, catchError } from "rxjs/operators";
import { ofType, combineEpics } from "redux-observable";
import SimpleProvenanceContract from "ProvNet/build/linked/SimpleProvenanceContract";
import { from, of, forkJoin } from "rxjs";
import ContractDetails from "../models/ContractDetails";
import ProvContractList from "../models/ProvContractList";
import ProvContract from "../models/ProvContract";

export const editDetailEpic = (action$, state$) => action$.pipe(
    ofType(actions.types.editDetails),
    withLatestFrom(state$),
    flatMap(([action, state]) => {
        let web3Instance = new state.web3.eth.Contract(SimpleProvenanceContract.truffle.abi, action.address);
        const promiseCallback = (resolve, reject) => (err, id) => {
            if(err) {
                reject(err);
            }
            resolve(id);
        };
        let accountsPromise = new Promise((resolve, reject) => {
            state.web3.eth.getAccounts(promiseCallback(resolve, reject))
        });

        let currentDetails = ProvContract.getDetails(ProvContractList.getSelectedContract(ProvContractList.getSelf(state)));

        return from(
            accountsPromise
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
        let title = ContractDetails.getTitle(action.details);
        let titleObs = () => web3Instance.methods.setTitle(title).send({from: account}); 
        if(title === ContractDetails.getTitle(currentDetails)) {
            titleObs = () => of({noChange: true});
        }
        
        let desc = ContractDetails.getDescription(action.details);
        let descObs = () => web3Instance.methods.setDescription(desc).send({from: account});
        if(desc === ContractDetails.getDescription(currentDetails)) {
            descObs = () => of({noChange: true});
        }

        let url = ContractDetails.getLogoUrl(action.details);
        let urlObs = () => web3Instance.methods.setLogoUrl(url).send({from: account}); 
        if(url === ContractDetails.getLogoUrl(currentDetails)) {
            urlObs = () => of({noChange: true});
        }
        
        return forkJoin (
            titleObs(),
            descObs(),
            urlObs()
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
        case modelActions.types.editDetailsModalOpen:
            if(action.value) {
                state = EditModalList.putOnce(state, new EditModalLeaf(action.address));
            }
            return EditModalList.setOpen(state, action.value);
        default:
            return state;
    }
}