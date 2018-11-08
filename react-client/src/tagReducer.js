import ListModel from "./models/ListModel";
import * as modelActions from "./modelActions";
import { Tag } from "./models";

export const tagReducer = (
    state = new ListModel("tags", 
        (item) => ListModel.getId(item), 
        (id) => new ListModel(id, (item) => Tag.getId(item), (id) => new Tag(id, ""))
    ), action) => {
        let list = ListModel.get(state, action.address);
        switch(action.type) {
            case modelActions.types.typeLoaded:
                return ListModel.add(state, ListModel.add(list, action.tag));
            default:
                return state;
    }
};