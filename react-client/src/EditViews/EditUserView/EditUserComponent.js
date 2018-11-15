import { connect } from 'react-redux';

import { SelectSelector} from "../EditTagView/imports";
import * as actions from "../actions";
import ValidatedEditTagView from "../EditTagView/EditTagView";
import EditModelSelector from '../../models/selectors/EditModelSelector';
import { withDefaultDispatch, withDefaultMerge } from '../EditModal/EditModal';

export const mapStateToProps = (state) => {    
    return {
        editModel: EditModelSelector.getUserAddModel(state),
        address: SelectSelector.getSelectedContract(state),
        header: "Add User",
        labelTitle: "User Address"
    }
}

export const mapDispatchToProps = (dispatch) => {
    return withDefaultDispatch(dispatch, {
        onSubmit: (address, user) => dispatch(actions.onAddUser(address, user, "")),
    });
}

export const mergeProps = (stateProps, dispatchProps, ownProps) => {
    return withDefaultMerge(stateProps, dispatchProps, ownProps, {
        onSubmit: (user) => dispatchProps.onSubmit(stateProps.address, user)
    });
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ValidatedEditTagView);