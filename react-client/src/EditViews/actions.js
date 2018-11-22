import EditModelSelector from "../models/selectors/EditModelSelector";
import { ContractDetails, User, Link } from "../models";
import ContractEditModelMap from "../models/maps/ContractEditModelMap";

export const types = {
    nop: "NO_OPERATION",

    editModalOpen: "EDIT_MODAL_OPEN",
    editError: "EDIT_ERROR",
    editSuccess: "EDIT_SUCCESS",
    editModalClear: "EDIT_MODAL_CLEAR",

    editTag: "EDIT_TAG",
    editDetails: "EDIT_DETAILS",
    addUser: "ADD_USER",
    editLink: "EDIT_LINK",
    
    deployContract: "DEPLOY_CONTRACT",
    deployContractSuccess: "DEPLOY_CONTRACT_SUCCESS",
    deployContractModalOpen: "DEPLOY_CONTRACT_MODAL_OPEN",

    reselect: "EDIT_MODAL_RESELECT"
}

export const onEditModalReselect = (address, id, current, modal) => ({
    type: types.reselect,
    address,
    id,
    current,
    modal
});

// edit

const onEditBase = (type, address, id, payload) => ({
    type: type,
    address: address,
    id: id,
    payload: payload
})

export const onDeployContract = (payload) => onEditBase(types.deployContract, EditModelSelector.newContractKey, EditModelSelector.newContractKey, payload);

export const onEditTag = (address, id, tag, origTag) => onEditBase(types.editTag, address, id, {
    tag,
    origTag
});

export const onEditLink = (address, id, tags, origLink) => onEditBase(
    types.editLink,
    address,
    id,
    {
        link: new Link(id, tags),
        origLink
    }
)
//todo-sv: loading on user edit?
export const onAddUser = (address, user, specialRoles, roles, origUser) => onEditBase(
    types.addUser,
    address,
    user,
    {
        user: new User(user, specialRoles, roles),
        origUser
    }
)

export const onEditDetails = (address, title, desc, url, origDetails) => onEditBase(
    types.editDetails, 
    address, 
    EditModelSelector.detailsKey, 
    {
        details: new ContractDetails(title, desc, url),
        origDetails
    }
);

// other

export const onNop = () => ({
    type: types.nop
});

// open

const onEditModalOpenBase = (type, value, address, id, modal) => ({
    type: type,
    value: value,
    address: address,
    id: id,
    modal
});

export const onEditModalOpen = (value, address, id, modal) => onEditModalOpenBase(types.editModalOpen, value, address, id, modal);

export const onDeployContractOpen = (value) => onEditModalOpenBase(
    types.deployContractModalOpen, 
    value, 
    EditModelSelector.newContractKey, 
    EditModelSelector.newContractKey,
    ContractEditModelMap.modals.deploy
);

export const onEditDetailsModalOpen = (value, address) => onEditModalOpen(
    value, 
    address, 
    EditModelSelector.detailsKey,
    ContractEditModelMap.modals.details
); 

export const onEditTagModalOpen = (value, address, id) => onEditModalOpen(
    value,
    address,
    id,
    ContractEditModelMap.modals.editTag
);

export const onEditUserModalOpen = (value, address, id) => onEditModalOpen(
    value,
    address,
    id,
    ContractEditModelMap.modals.editUser
);

export const onEditLinkModalOpen = (value, address, id) => onEditModalOpen(
    value,
    address,
    id,
    ContractEditModelMap.modals.editLink
)

// clear

export const onEditModalClear = (address, id) => ({
    type: types.editModalClear,
    address: address,
    id: id
})

// success

export const onEditSuccessBase = (type, address, id, payload) => ({
    type: type,
    address: address,
    id: id,
    payload: payload
})

export const onEditSuccess = (address, id) => onEditSuccessBase(types.editSuccess, address, id);

export const onEditDetailsSuccess = (address) => onEditSuccess(
    address, 
    EditModelSelector.detailsKey
);

export const onDeployContractSuccess = (payload) => onEditSuccessBase(types.deployContractSuccess, EditModelSelector.newContractKey, EditModelSelector.newContractKey, payload);

// error

export const onEditError = (address, id, error) => ({
    type: types.editError,
    address: address,
    id: id,
    error: error
})

export const onDeployContractError = (error) => onEditError(EditModelSelector.newContractKey, EditModelSelector.newContractKey, error);

export const onEditDetailsError = (address, error) => onEditError(address, EditModelSelector.detailsKey, error);