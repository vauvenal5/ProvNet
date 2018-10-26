import ContractDetails from "../models/ContractDetails";

export const types = {
    editDetails: "EDIT_DETAILS",
    nop: "NO_OPERATION"
}

export const onEditDetails = (address, title, desc, url) => ({
    type: types.editDetails,
    address: address,
    details: new ContractDetails(title, desc, url)
});

export const onNop = () => ({
    type: types.nop
});