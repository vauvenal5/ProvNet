import React, {Fragment} from 'react';
import { connect } from 'react-redux';

import { 
    Modal,
    Button, 
    Icon,  
    Message, 
    Loader, 
    Dimmer
} from 'semantic-ui-react';
import {Form} from "formsy-semantic-ui-react";
import {EditModal} from "../EditModal/Component";
import * as modelActions from '../modelActions';

export class EditErrorModal extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return(
            <Fragment>
            <Modal
                basic
                size="small"
                open={this.props.open}
            >
                <Modal.Content>
                    <Message
                        error
                        icon
                    >
                        <Icon name="frown outline"/>
                        <Message.Content>
                            <Message.Header>{this.props.header}</Message.Header>
                            <p>
                                {this.props.message} Possible steps:
                            </p>
                            <Message.List>
                                <Message.Item>Error was logged to the console for further investigation.</Message.Item>
                                <Message.Item>Check your MetaMask for more error messages.</Message.Item>
                                <Message.Item>Contact your administrator for further help.</Message.Item>
                                <Message.Item>Or simply try again.</Message.Item>
                            </Message.List>
                        </Message.Content>                    
                    </Message>
                </Modal.Content>
                <Modal.Actions>
                    <Button 
                        color='red' 
                        inverted
                        onClick={this.props.onClearResult}
                    >
                        <Icon name='close' /> Close
                    </Button>
                </Modal.Actions>
            </Modal>
            </Fragment>
        );
    }
}