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

export class EditModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            title: "",
            link: "",
            desc: ""
        }
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

        let defaultWarning;
        if(this.props.defaultWarning) {
            defaultWarning = (
                <Message 
                    warning
                    icon="warning sign"
                    header="You are about to make on-chain changes to this contract!"
                    content="This action will use one or more transactions to make changes to your contract."
                />
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
                    {defaultWarning}
                    {this.props.children}
                </Modal.Content>
                <Modal.Actions>
                    <Button positive icon labelPosition="left" disabled={!this.props.commitValid} onClick={this.props.onCommit}>
                        <Icon name="upload" />
                        Commit
                    </Button>
                    {deleteButton}
                </Modal.Actions>
            </Modal>

            <EditErrorModal 
                open={EditModel.isError(this.props.editModel)}
                header={EditModel.getStateProps(this.props.editModel).header}
                message={EditModel.getStateProps(this.props.editModel).msg}
                list={EditModel.getStateProps(this.props.editModel).list}
                onClearResult={this.props.onClearResult}
            />
        </Fragment>
        );
    }
}

export const withDefaultDispatch = (dispatch, dispatchProps) => {
    return Object.assign({}, {
        onClose: (address, id) => dispatch(actions.onEditModalOpen(false, address, id)),
        onClear: (address, id) => dispatch(actions.onEditModalClear(address, id))
    }, dispatchProps);
}

export const withDefaultMerge = (stateProps, dispatchProps, ownProps, props) => {
    return Object.assign({}, ownProps, stateProps, dispatchProps, {
        onClose: () => dispatchProps.onClose(stateProps.address, EditModel.getId(stateProps.editModel)),
        onClear: () => dispatchProps.onClear(stateProps.address, EditModel.getId(stateProps.editModel)),
    }, props);
}