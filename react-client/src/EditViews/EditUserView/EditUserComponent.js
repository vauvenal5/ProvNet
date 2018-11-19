import { connect } from 'react-redux';

import { SelectSelector, TagSelector} from "../EditTagView/imports";
import * as actions from "../actions";
import ValidatedEditTagView from "../EditTagView/EditTagView";
import EditModelSelector from '../../models/selectors/EditModelSelector';
import { withDefaultDispatch, withDefaultMerge } from '../EditModal/EditModal';
import {EditUserView} from './EditUserView';
import { User, SpecialRoleSelector, UserSelector } from '../../models';
import EditModel from '../../models/EditModel';

export const mapStateToProps = (state) => {    
    let model = EditModelSelector.getUserAddModel(state);
    return {
        editModel: model,
        address: SelectSelector.getSelectedContract(state),
        header: "Add User",
        labelTitle: "User Address",
        tags: TagSelector.getContractSelected(state),
        specials: SpecialRoleSelector.getContractSelected(state),
        user: UserSelector.getContractSelectedUser(state, EditModel.getId(model)),
        users: UserSelector.getContractSelected(state)
    }
}

export const mapDispatchToProps = (dispatch) => {
    return withDefaultDispatch(dispatch, {
        onSubmit: (address, user, specialRoles, roles, origUser) => dispatch(actions.onAddUser(address, user, specialRoles, roles, origUser)),
        onReselect: (address, id, current) => dispatch(actions.onEditModalReselect(address, id, current))
    });
}

export const mergeProps = (stateProps, dispatchProps, ownProps) => {
    return withDefaultMerge(stateProps, dispatchProps, ownProps, {
        onSubmit: (user, tags, specials) => dispatchProps.onSubmit(stateProps.address, user, specials, tags, stateProps.user),
        onReselect: (id) => dispatchProps.onReselect(stateProps.address, id, EditModel.getId(stateProps.editModel))
    });
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(EditUserView);