import React, {Fragment} from 'react';
import { connect } from 'react-redux';

import { 
    Modal,
    Button, 
    Icon,  
    Image,
    Message, 
    Grid,
    Item,
    Loader, 
    Dimmer
} from 'semantic-ui-react';

import {EditErrorModal} from "./EditErrorModal";
import EditModel from '../../models/EditModel';
import * as actions from "../actions";
import EditModelSelector from '../../models/selectors/EditModelSelector';
import { SelectSelector } from '../../models';

export class EditModal extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        let deleteButton;
        if(this.props.delete) {
            deleteButton = (
                <Button negative floated="left" icon labelPosition="left" disabled={!this.props.deleteValid} onClick={this.props.onDelete}>
                    <Icon name="trash" />
                    Delete
                </Button>
            );
        }

        let submitButton;
        if(this.props.submitButton) {
            submitButton = (
                <Button positive icon labelPosition="left" disabled={!this.props.commitValid} onClick={this.props.onSubmit}>
                    <Icon name="upload" />
                    Commit
                </Button>
            );
        }

        return(
        <Fragment>
            <Modal 
                open={EditModel.isOpen(this.props.editModel)}
                onClose={this.props.onClose}
                closeIcon
                size="small"
            >
                <Modal.Header>
                    {this.props.header}
                </Modal.Header>

                <Dimmer active={EditModel.isLoading(this.props.editModel)}>
                    <Loader size="big" content="Sending..."/>
                </Dimmer>
                
                <Modal.Content scrolling>
                    <Message 
                        hidden={this.props.warning.hidden}
                        warning
                        icon="warning sign"
                        header={this.props.warning.header}
                        content={this.props.warning.msg}
                    />
                    {this.props.children}
                </Modal.Content>
                <Modal.Actions>
                    {submitButton}
                    {deleteButton}
                </Modal.Actions>
            </Modal>

            <EditErrorModal 
                open={EditModel.isError(this.props.editModel)}
                header={EditModel.getStateProps(this.props.editModel).header}
                message={EditModel.getStateProps(this.props.editModel).msg}
                list={EditModel.getStateProps(this.props.editModel).list}
                onClearResult={this.props.onClear}
            />
        </Fragment>
        );
    }
}

export const withDefaultMap = (state, props) => {
    return Object.assign({}, {
        editModel: EditModelSelector.getSelectedModel(state),
        address: SelectSelector.getSelectedContract(state),
    }, props);
}

export const withDefaultDispatch = (dispatch, dispatchProps) => {
    return Object.assign({}, {
        onClose: (address, id, modal) => dispatch(
            actions.onEditModalOpen(false, address, id, modal)
        ),
        onClear: (address, id) => dispatch(
            actions.onEditModalClear(address, id)
        ),
        onReselect: (address, id, current, modal) => dispatch(
            actions.onEditModalReselect(address, id, current, modal)
        )
    }, dispatchProps);
}

export const withDefaultMerge = (stateProps, dispatchProps, ownProps, props) => {
    let modal = EditModel.getModal(stateProps.editModel);
    return Object.assign({}, ownProps, stateProps, dispatchProps, {
        onClose: () => dispatchProps.onClose(
            stateProps.address, 
            EditModel.getId(stateProps.editModel), 
            modal
        ),
        onClear: () => dispatchProps.onClear(
            stateProps.address, EditModel.getId(stateProps.editModel)
        ),
        onReselect: (id) => dispatchProps.onReselect(
            stateProps.address, 
            id, 
            EditModel.getId(stateProps.editModel), 
            modal
        ),
    }, props);
}

export const modalPropsFrom = (props, submitFunc, header, warning={
    hidden: false,
    header: "You are about to make on-chain changes to this contract!",
    msg: "This action will use one or more transactions to make changes to your contract."
}) => {
    return {
        editModel: props.editModel,
        commitValid: props.valid,
        onClose: props.onClose,
        onClear: props.onClear,
        onSubmit: submitFunc,
        header: header,
        warning: warning,
    }
};