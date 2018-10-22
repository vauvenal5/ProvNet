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
import {Form} from "formsy-semantic-ui-react";

import * as modelActions from '../modelActions';

export class EditDetailsView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            title: "",
            link: "",
            desc: ""
        }
    }

    render() {
        return(
        <Fragment>
            <Modal 
                open={false}
                onClose={this.props.onClose}
                closeIcon
                size="small"
            >
                <Modal.Header>
                    Edit Contract Details
                </Modal.Header>

                <Dimmer active={false}>
                    <Loader size="big" content="Sending..."/>
                </Dimmer>
                
                <Modal.Content scrolling>
                    <Message 
                        warning
                        icon="warning sign"
                        header="You are about to make on-chain changes to this contract!"
                        content="This action will use one or more transactions to make changes to your contract."
                    />
                
                    <Grid stackable>
                        <Grid.Column width="4" verticalAlign="middle">
                            <Image src='https://react.semantic-ui.com/images/wireframe/square-image.png' centered circular size='small'/>
                        </Grid.Column>
                        <Grid.Column width="12">
                            <Form>
                                <Message 
                                    warning
                                    icon="warning sign"
                                    header="You are about to make on-chain changes to this contract!"
                                    content="This action will use one or more transactions to make changes to your contract."
                                />
                                
                                <Form.Group widths="equal">
                                    <Form.Input
                                        label="Contract Title"
                                        name="title"
                                        placeholder="MyCompaniesTitle"
                                        required
                                        value={this.state.title}
                                        
                                    />
                                
                                    <Form.Input
                                        label="Contract Logo URL"
                                        name="link"
                                        placeholder="MyCompaniesImageURL"
                                        value={this.state.url}
                                    />
                                </Form.Group>
                                
                                <Form.TextArea 
                                    label="Contract Description"
                                    name="desc"
                                    placeholder="Write here a short description of your contract."
                                    value={this.state.desc}
                                    style={{ minHeight: 90 }}
                                />
                            </Form>
                        </Grid.Column> 
                    </Grid>   
                </Modal.Content>
                <Modal.Actions>
                    <Button color="olive" type="submit">Save</Button>
                </Modal.Actions>
                
            </Modal>
        </Fragment>
        );
    }
}