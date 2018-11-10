import * as modelActions from "./modelActions";
import ContractLinkMap from "./models/maps/ContractLinksMap";
import LinkSelector from "./models/selectors/LinkSelector";

export const linkReducer = (
    state = new ContractLinkMap(LinkSelector.key),
    // state = new ContractListMap("links",
    //     (item) => Link.getAddress(item),
    //     (id) => new Link(id)
    // ),
    action
) => {
    switch(action.type) {
        case modelActions.types.linkLoaded:
            return ContractLinkMap.add(state, action.address, action.link);
        //return ContractListMap.add(state, action.address, action.link);
        default:
            return state;
    }
};