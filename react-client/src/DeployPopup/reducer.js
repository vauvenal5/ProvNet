import * as actions from "../modelActions";
import ContractDeployment from "./ContractDeployment";

export const reducer = (
    state = new ContractDeployment(), 
    action ) => {
        switch(action.type) {
            case actions.types.deployContract:
                return state.setLoading();
            case actions.types.deployedContract:
                return state.setAddress(action.address).setSuccess();
            case actions.types.deployContractFailed:
                return state.setError();
            case actions.types.deployContractModalOpen:
                return state.setOpen(action.value);
            case actions.types.deployContractModalClear:
                return state.setCleared();
            default:
                return state;
        }
}