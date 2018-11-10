import MapModel from "./models/MapModel";
import Link from "./models/Link";
import * as modelActions from "./modelActions";
import ContractListMap from "./models/ContractListMap";

export const linkReducer = (
    state = new ContractListMap("links",
        (item) => Link.getAddress(item),
        (id) => new Link(id)
    ),
    action
) => {
    switch(action.type) {
        case modelActions.types.linkLoaded:
            return ContractListMap.add(state, action.address, action.link);
        default:
            return state;
    }
};