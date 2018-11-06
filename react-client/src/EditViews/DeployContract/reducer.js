import {modelActions, MetaMaskPromiseFactory} from "./imports";
import { combineEpics, ofType } from 'redux-observable';
import ContractDeployment from "./ContractDeployment";
import { 
    withLatestFrom, 
    map,  
    flatMap, 
    filter,
    reduce,
    catchError, 
    mapTo} from "rxjs/operators";
import { of, from, zip, forkJoin} from 'rxjs';
import SimpleProvenanceContract from "ProvNet/build/linked/SimpleProvenanceContract";

export const deployContractModalOpenEpic = (action$, state$) => action$.pipe(
    ofType(modelActions.types.deployContractModalOpen),
    filter(action => action.value === true),
    withLatestFrom(state$),
    flatMap(([action, state]) => {
        return from(
            MetaMaskPromiseFactory.networkIdPromise(state.web3)
        )
    }),
    filter((id) => SimpleProvenanceContract.binary[id] === undefined),
    map((id) => modelActions.onDeployContractFailed({
        msg: "No pre-build binaries found for chosen network. If you are deploying on a private network please pre-build the contracts for this network.",
        header: "Network unknown!",
        list: false
    }))
);

export const deployContractEpic = (action$, state$) => action$.pipe(
    ofType(modelActions.types.deployContract),
    withLatestFrom(state$),
    flatMap(([action, state]) => {
        return zip(
            MetaMaskPromiseFactory.networkIdPromise(state.web3), 
            MetaMaskPromiseFactory.accountsPromise(state.web3), 
            (id, accounts) => ({
                account: accounts[0],
                web3Instance: new state.web3.eth.Contract(
                    SimpleProvenanceContract.truffle.abi, 
                    undefined, 
                    //todo-sv: add some check if binary exists for this network
                    {data: SimpleProvenanceContract.binary[id]}
                )
            })
        );
    }),
    flatMap(({account, web3Instance}) => {
        return from(
            web3Instance.deploy().send({from: account})
        ).pipe(
            map(res => {console.log(res); return modelActions.onDeployedContract(res.options.address);}),
            catchError(err => {
                console.log(err);
                return of(modelActions.onDeployContractFailed({
                    msg: "We were not able to deploy your contract.",
                    header: "Contract deployment failed!",
                    list: true
                }));
            })
        )
    }),  
);

export const epic = combineEpics(deployContractEpic, deployContractModalOpenEpic);

export const reducer = (
    state = new ContractDeployment(), 
    action ) => {
        switch(action.type) {
            case modelActions.types.deployContract:
                return state.setLoading();
            case modelActions.types.deployedContract:
                return state.setAddress(action.address).setSuccess();
            case modelActions.types.deployContractFailed:
                return state.setError(action.error);
            case modelActions.types.deployContractModalOpen:
                return state.setOpen(action.value);
            case modelActions.types.deployContractModalClear:
                return state.setCleared();
            default:
                return state;
        }
}