import ListModel from "./models/ListModel";
import * as modelActions from "./modelActions";
import { Tag } from "./models";
import ContractListMap from "./models/ContractListMap";

export const tagReducer = (
    state = new ContractListMap("tags",
        (item) => Tag.getId(item),
        (id) => new Tag(id, "")
    ),
    action
) => {
    switch(action.type) {
        case modelActions.types.typeLoaded:
            return ContractListMap.add(state, action.address, action.tag);
        default:
            return state;
    }
};