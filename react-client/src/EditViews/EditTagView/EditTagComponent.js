import { connect } from 'react-redux';

import { SelectSelector, TagSelector} from "./imports";
import * as actions from "../actions";
import ValidatedEditTagView from "./EditTagView";
import EditModelSelector from '../../models/selectors/EditModelSelector';
import EditModel from '../../models/EditModel';
import { withDefaultDispatch, withDefaultMerge, withDefaultMap } from '../EditModal/EditModal';
import { connectWithDefault } from '../connectWithDefault';

export const mapStateToProps = (state) => {
    let selectedModal = EditModelSelector.getSelectedModel(state); 
    //let selectedModal = EditModalTagList.getSelected(state.editTag);
    //todo-sv: We could even say that the EditModalSelector ist responsible for selecting the tag since he has the complete view.
    let selectedTag = TagSelector.getContractSelectedTag(state, EditModel.getId(selectedModal));
    
    return {
        title: selectedTag.getTitle(),
        header: "Add Tag",
        labelTitle: "Tag Title"
    };
}

export const mapDispatchToProps = (dispatch) => {
    return {
        onSubmit: (address, tagId, title, origTitle) => dispatch(actions.onEditTag(address, tagId, title, origTitle)),
    };
}

export const mergeProps = (stateProps, dispatchProps, ownProps) => {
    return {
        onSubmit: (title) => dispatchProps.onSubmit(stateProps.address, EditModel.getId(stateProps.editModel), title, stateProps.title),
    };
}

export default connectWithDefault(mapStateToProps, mapDispatchToProps, mergeProps)(ValidatedEditTagView);