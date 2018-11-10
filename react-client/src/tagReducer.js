import * as modelActions from "./modelActions";
import { TagSelector } from "./models";
import ContractTagsMap from "./models/ContractTagsMap";

export const tagReducer = (
    state = new ContractTagsMap(TagSelector.key),
    action
) => {
    switch(action.type) {
        case modelActions.types.typeLoaded:
            return ContractTagsMap.add(state, action.address, action.tag);
        default:
            return state;
    }
};