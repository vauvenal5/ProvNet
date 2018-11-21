import { connect } from 'react-redux';

import EditModelSelector from "../../models/selectors/EditModelSelector";
import { TagSelector, User, ContractTagsMap, SelectSelector, LinkSelector } from "../../models";
import TagOptionsMap from "../../models/maps/TagOptionsMap";
import EditModel from "../../models/EditModel";
import { dispatch } from "rxjs/internal/observable/pairs";
import { withDefaultDispatch, withDefaultMerge } from "../EditModal/EditModal";
import * as actions from "../actions";
import { EditUserView } from "./EditUserView";

export const mapStateToProps = (state) => {
    let model = EditModelSelector.getSelectedEditModel(state);

    let tags = TagSelector.getContractSelected(state);
    tags = TagOptionsMap.fromTagsMap(User.roleKey, "Link Types", "tag", tags);

    let options = new ContractTagsMap("options", tags);

    return{
        editModel: model,
        address: SelectSelector.getSelectedContract(state),
        header: "Add Link",
        labelTitle: "Link Address",
        labelTags: "Link Types",
        options: options,
        tagged: LinkSelector.getEditSelectedLink(state),
        //todo-sv: links from contract selected or from link selected?
        taggedMap: LinkSelector.getEditSelectedLinks(state)
    };
}

export const mapDispatchToProps = (dispatch) => {
    return withDefaultDispatch(dispatch, {
        onSubmit: (address, link, tags, origLink) => dispatch(actions.onEditLink(address, link, tags, origLink)),
    });
}

export const mergeProps = (stateProps, dispatchProps, ownProps) => {
    return withDefaultMerge(stateProps, dispatchProps, ownProps, {
        onSubmit: (link, tags) => dispatchProps.onSubmit(stateProps.address, link, tags, stateProps.tagged),
    });
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(EditUserView);