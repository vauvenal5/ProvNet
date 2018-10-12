import ProvContract from "./models/ProvContract";
import Tag from "./models/Tag";
import Link from "./models/Link";

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
};

export const onContractLoad = (address) => ({
    type: types.contractLoad,
    address: address
});

export const onContractDetailsLoaded = (address, title, description, logoUrl) => ({
    type: types.contractDetailsLoaded,
    address: address,
    details: {
        title: title,
        description: description,
        logoUrl: logoUrl
    }
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