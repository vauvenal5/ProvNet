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

import {EditErrorModal} from "./imports";

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
                open={this.props.isOpen}
                onClose={this.props.onClose}
                closeIcon
                size="small"
            >
                <Modal.Header>
                    {this.props.header}
                </Modal.Header>

                <Dimmer active={this.props.loading}>
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
                open={this.props.error}
                header={this.props.errorProps.header}
                message={this.props.errorProps.msg}
                list={this.props.errorProps.list}
                onClearResult={this.props.onClearResult}
            />
        </Fragment>
        );
    }
}