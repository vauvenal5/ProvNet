import { withLatestFrom, map, flatMap } from "rxjs/operators";
import { from, of, defer } from "rxjs";
import SimpleProvenanceContract from "ProvNet/build/linked/SimpleProvenanceContract";
import { MetaMaskPromiseFactory } from "./MetaMaskPromiseFactory";

export const withWeb3ContractFrom = (state$) => {
    return function withWeb3ContractFromImplementation(source) {
        return source.pipe(
            withLatestFrom(state$),
            map(([action, state]) => ({
                action, 
                web3Instance:  new state.web3.eth.Contract(SimpleProvenanceContract.truffle.abi, action.address), 
                web3: (state.web3)
            }))
        );
    }
}

export const withAccountInfo = () => {
    return function withAccountInfoImplementation(source) {
        return source.pipe(
            flatMap(({action, web3Instance, web3}) => {
                return from(
                    MetaMaskPromiseFactory.accountsPromise(web3)
                ).pipe(
                    map((accounts) => ({
                        web3Instance,
                        account: accounts[0],
                        action,
                    }))
                )
            }),
        )
    }
}