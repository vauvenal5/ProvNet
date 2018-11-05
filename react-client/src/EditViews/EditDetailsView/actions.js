import { ContractDetails } from "./imports";

export const types = {
    editDetails: "EDIT_DETAILS",
    editDetailsError: "EDIT_DETAILS_ERROR",
    editDetailsSuccess: "EDIT_DETAILS_SUCCESS",
    editDetailsModalClear: "EDIT_DETAILS_MODAL_CLEAR",
    nop: "NO_OPERATION"
}

export const onEditDetails = (address, title, desc, url) => ({
    type: types.editDetails,
    address: address,
    details: new ContractDetails(title, desc, url)
});

export const onEditDetailsError = (address, error) => ({
    type: types.editDetailsError,
    address: address,
    error: error
});

export const onEditDetailsSuccess = (address) => ({
    type: types.editDetailsSuccess,
    address: address
})

export const onEditDetailsModalClear = (address) => ({
    type: types.editDetailsModalClear,
    address: address
})

export const onNop = () => ({
    type: types.nop
});