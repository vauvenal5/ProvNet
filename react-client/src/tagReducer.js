import MapModel from "./models/MapModel";
import * as modelActions from "./modelActions";
import { Tag } from "./models";
import ContractListMap from "./models/ContractListMap";
import ContractTagsMap from "./models/ContractTagsMap";

export const tagReducer = (
    // state = new ContractListMap("tags",
    //     (item) => Tag.getId(item),
    //     (id) => new Tag(id, "")
    // ),
    state = new ContractTagsMap("tags"),
    action
) => {
    switch(action.type) {
        case modelActions.types.typeLoaded:
            return ContractTagsMap.add(state, action.address, action.tag);
        default:
            return state;
    }
};