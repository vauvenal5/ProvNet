import ProvContract from "./models/ProvContract";
import Tag from "./models/Tag";

export const types = {
    contractLoad: "CONTRACT_LOAD",
    contractDetailsLoaded: "CONTRACT_DETAILS_LOADED",
    
    contractSelect: "CONTRACT_SELECT",
    
    typesLoad: "TYPES_LOAD",
    typeLoad: "TYPE_LOAD",
    typeLoaded: "TYPE_LOADED",
    
    linksLoad: "LINKS_LOAD",
    linkLoaded: "LINK_LOADED",
};

export const onContractLoad = (address) => ({
    type: types.contractLoad,
    address: address
});

export const onContractDetailsLoaded = (contract) => ({
    type: types.contractDetailsLoaded,
    contract: contract
});

export const onContractSelect = (address) => ({
    type: types.contractSelect,
    address: address
});

export const onTypesLoad = (contract) => ({
    type: types.typesLoad,
    contract: contract
});

export const onTypeLoad = (contractAddress, tagId) => ({
    type: types.typeLoad,
    address: contractAddress,
    tag: new Tag(tagId, "")
});

export const onTypeLoaded = (address, tag) => ({
    type: types.typeLoaded,
    address: address,
    tag: tag
});

export const onLinksLoad = (address) => ({
    type: types.linksLoad,
    address: address,
});

export const onLinkLoaded = (contractAddress, link) => ({
    type: types.linkLoaded,
    contractAddress: contractAddress,
    link: link,
});