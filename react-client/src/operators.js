import { withLatestFrom, map } from "rxjs/operators";
import SimpleProvenanceContract from "ProvNet/build/linked/SimpleProvenanceContract";

export const withWeb3ContractFrom = (state$) => {
    return function withWeb3ContractFromImplementation(source) {
        return source.pipe(
            withLatestFrom(state$),
            map(([action, state]) => ([action, new state.web3.eth.Contract(SimpleProvenanceContract.truffle.abi, action.address)]))
        );
    }
}