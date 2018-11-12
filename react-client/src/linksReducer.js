import * as modelActions from "./modelActions";
import { ContractLinksMap, LinkSelector } from "./models";

export const linkReducer = (
    state = new ContractLinksMap(LinkSelector.key),
    // state = new ContractListMap("links",
    //     (item) => Link.getAddress(item),
    //     (id) => new Link(id)
    // ),
    action
) => {
    switch(action.type) {
        case modelActions.types.linkLoaded:
            return ContractLinksMap.add(state, action.address, action.link);
        //return ContractListMap.add(state, action.address, action.link);
        default:
            return state;
    }
};