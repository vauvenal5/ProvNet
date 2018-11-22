import { connect } from 'react-redux';

import { SelectSelector, TagSelector} from "../EditTagView/imports";
import * as actions from "../actions";
import ValidatedEditTagView from "../EditTagView/EditTagView";
import EditModelSelector from '../../models/selectors/EditModelSelector';
import { withDefaultDispatch, withDefaultMerge, withDefaultMap } from '../EditModal/EditModal';
import {EditUserView} from './EditUserView';
import { User, SpecialRoleSelector, UserSelector, TagsMap, ContractTagsMap } from '../../models';
import EditModel from '../../models/EditModel';
import TagOptionsMap from '../../models/maps/TagOptionsMap';
import { connectWithDefault } from '../connectWithDefault';

export const mapStateToProps = (state) => {    
    //let model = EditModelSelector.getUserAddModel(state);
    let model = EditModelSelector.getSelectedModel(state);
    let tags = TagSelector.getContractSelected(state);
    tags = TagOptionsMap.fromTagsMap(User.roleKey, "Link Roles", "tag", tags);
    let specials = SpecialRoleSelector.getContractSelected(state);
    specials = TagOptionsMap.fromTagsMap(User.specialKey, "Special Roles", "star", specials);

    let options = new ContractTagsMap(
        "options",
        specials,
        tags
    );

    return {
        header: "Add User",
        labelTitle: "User Address",
        labelTags: "User Roles",
        options: options,
        tagged: UserSelector.getContractSelectedUser(state, EditModel.getId(model)),
        taggedMap: UserSelector.getContractSelected(state)
    };
}

export const mapDispatchToProps = (dispatch) => {
    return {
        onSubmit: (address, user, specialRoles, roles, origUser) => dispatch(actions.onAddUser(address, user, specialRoles, roles, origUser)),
    };
}

export const mergeProps = (stateProps, dispatchProps, ownProps) => {
    return {
        onSubmit: (user, tags, specials) => dispatchProps.onSubmit(stateProps.address, user, specials, tags, stateProps.tagged),
    };
}

export default connectWithDefault(mapStateToProps, mapDispatchToProps, mergeProps)(EditUserView);