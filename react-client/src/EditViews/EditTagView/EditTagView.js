import React, {Fragment} from 'react';
import { connect } from 'react-redux';

import {Form} from "formsy-semantic-ui-react";
import {ProvContract, ProvContractList, Tag, EditModalWrapper, withFormValidation, RootSelector} from "./imports";
import * as actions from "./actions";
import EditModalTagList from './EditModalTagList';
import { withDefaultProps } from '../withDefaultProps';
import Select from '../../models/Select';

export class EditTagView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            title: this.props.title
        }
    }

    setTitle(value) {
        this.setState({title: value});
    }

    onSubmit() {
        this.props.onSubmit(this.props.address, this.props.tagId, this.state.title);
    }

    render() {
        return(
            <EditModalWrapper 
                header="Add Tag" 
                {...this.props.defaultProps}
                defaultWarning 
                onCommit={this.onSubmit.bind(this)}
            >
                <Form
                    onValidSubmit={this.onSubmit.bind(this)}
                    {...this.props.formValidation}
                >                            
                    <Form.Group inline>
                        <Form.Input
                            label="Tag Title"
                            name="title"
                            placeholder="MyCompaniesTag"
                            required
                            value={this.state.title}
                            onChange={(e, value) => this.setTitle(value.value)}
                        />
                    </Form.Group>
                </Form>
            </EditModalWrapper>
        );
    }
}

export const ValidatedEditTagView = withFormValidation(withDefaultProps(EditTagView));

export const mapStateToProps = (state) => {
    let contract = ProvContractList.getContract(RootSelector.getContracts(state), Select.getSelectedContract(RootSelector.getSelect(state)));
    let selectedModal = EditModalTagList.getSelected(state.editTag);
    let selectedTag = ProvContract.getTags(contract).getTag(EditModalTagList.getId(selectedModal));
    if(selectedTag === undefined) {
        selectedTag = new Tag("","");
    }
    
    return {
        editModalLeaf: selectedModal,
        isOpen: state.editTag.isOpen(),
        title: selectedTag.getTitle(),
        address: ProvContract.getAddress(contract),
        tagId: EditModalTagList.getId(selectedModal)
    }
}

export const mapDispatchToProps = (dispatch) => {
    return {
        onSubmit: (address, tagId, title) => dispatch(actions.onEditTag(address, tagId, title)),
        onClose: () => dispatch(actions.onEditTagModalOpen(false)),
        onClear: (address, tagId) => dispatch(actions.onEditTagModalClear(address, tagId))
    }
}

export const mergeProps = (stateProps, dispatchProps, ownProps) => {
    return Object.assign({}, ownProps, stateProps, dispatchProps, {
        onClear: () => dispatchProps.onClear(stateProps.address, stateProps.tagId)
    });
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ValidatedEditTagView);