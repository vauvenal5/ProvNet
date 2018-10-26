import * as actions from "../modelActions";
import EditModalLeaf from "../EditModal/EditModalLeaf";
import EditModalTagList from "./EditModalTagList";

export const reducer = (
    state = new EditModalTagList(), 
    action ) => {
        switch(action.type) {
            case actions.types.editTagModalOpen:
                if(action.value) {
                    state = EditModalTagList.putOnce(state, EditModalTagList.create(action.address, new EditModalLeaf(action.tagId)));
                    state = EditModalTagList.setSelected(state, action.address, action.tagId);
                }
                return state.setOpen(action.value);;
            default:
                return state;
        }
}