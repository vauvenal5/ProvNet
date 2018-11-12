import {Tag, Link, ContractDetails} from "./models";

export const types = {
    contractLoad: "CONTRACT_LOAD",
    contractDetailsLoaded: "CONTRACT_DETAILS_LOADED",
    
    //todo-sv: selections are only necessary for the UI not however for the node part... we should refactor this at a latter moment and move selection handling to a view reducer
    contractSelect: "CONTRACT_SELECT",
    contractSelected: "CONTRACT_SELECTED",
    linkSelect: "LINK_SELECT",
    linkSelected: "LINK_SELECTED",
  
    typeLoad: "TYPE_LOAD",
    typeLoaded: "TYPE_LOADED",
    
    linksLoad: "LINKS_LOAD",
    linkLoaded: "LINK_LOADED",

    //todo-sv: clean up model actions and root reducer!
    deployContract: "DEPLOY_CONTRACT",
    deployedContract: "DEPLOYED_CONTRACT",
    deployContractFailed: "DEPLOY_CONTRACT_FAILED",
    deployContractModalOpen: "DEPLOY_CONTRACT_MODAL_OPEN",
    deployContractModalClear: "DEPLOY_CONTRACT_MODAL_CLEAR",

    editDetailsModalOpen: "EDIT_DETAILS_MODAL_OPEN",

    userSpecialRoleLoaded: "USER_SPECIAL_ROLE_LOADED",
};

export const onContractLoad = (address) => ({
    type: types.contractLoad,
    address: address
});

export const onContractDetailsLoaded = (address, title, description, logoUrl) => ({
    type: types.contractDetailsLoaded,
    address: address,
    details: new ContractDetails(title, description, logoUrl)
});

export const onContractSelect = (address) => ({
    type: types.contractSelect,
    address: address
});

export const onContractSelected = (address) => ({
    type: types.contractSelected,
    address: address
});

export const onTypeLoad = (contractAddress, tagId) => ({
    type: types.typeLoad,
    address: contractAddress,
    tag: new Tag(tagId, "")
});

export const onTypeLoaded = (address, tagId, tagName) => ({
    type: types.typeLoaded,
    address: address,
    tag: new Tag(tagId, tagName)
});

export const onLinksLoad = (address) => ({
    type: types.linksLoad,
    address: address,
});

export const onLinkLoaded = (contractAddress, address, tags, title) => ({
    type: types.linkLoaded,
    address: contractAddress,
    link: new Link(address, tags, title),
});

export const onLinkSelect = (address) => ({
    type: types.linkSelect,
    address: address
});

export const onLinkSelected = (address) => ({
    type: types.linkSelected,
    address: address
});

export const onDeployContract = (title) => ({
    type: types.deployContract,
    title: title
})

export const onDeployedContract = (address) => ({
    type: types.deployedContract,
    address: address
})

export const onDeployContractFailed = (err) => ({
    type: types.deployContractFailed,
    error: err
})

export const onDeployContractModalOpen = (value) => ({
    type: types.deployContractModalOpen,
    value: value
})

export const onDeployContractModalClear = () => ({
    type: types.deployContractModalClear,
})

export const onEditDetailsModalOpen = (value, address) => ({
    type: types.editDetailsModalOpen,
    value: value,
    address: address
})

export const onUserSpecialRoleLoaded = (address, id, title) => ({
    type: types.userSpecialRoleLoaded,
    address: address,
    role: new Tag(id, title)
})