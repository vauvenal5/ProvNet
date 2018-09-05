export const types = {
    contractLoad: "CONTRACT_LOAD",
    contractLoadSuccess: "CONTRACT_LOAD_SUCCESS",
    contractLoadFailure: "CONTRACT_LOAD_FAILURE",
    contractSelect: "CONTRACT_SELECT",
    contractTypesLoad: "CONTRACT_TYPES_LOAD",
    contractTypeLoaded: "CONTRACT_TYPE_LOADED",
};

export const onContractLoad = (address) => ({
    type: types.contractLoad,
    address: address
});

export const onContractLoadSuccess = (contract) => ({
    type: types.contractLoadSuccess,
    contract: contract
});

export const onContractSelect = (address) => ({
    type: types.contractSelect,
    address: address
});

export const onTypesLoad = (contract) => ({
    type: types.contractTypesLoad,
    contract: contract
});

export const onContractTypeLoaded = (address, tag) => ({
    type: types.contractTypeLoaded,
    address: address,
    tag: tag
});