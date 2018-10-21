import React, {Fragment} from 'react';
import { connect } from 'react-redux';

import { 
    Modal,
    Button, 
    Icon,  
    Image,
    Message, 
    Grid,
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
                open={true}
                onClose={this.props.onClose}
                closeIcon
                size="small"
            >
                <Modal.Header>
                    Edit Contract Details
                </Modal.Header>

                

                <Modal.Content>
                    <Dimmer active={this.props.loading}>
                        <Loader size="big" content="Sending..."/>
                    </Dimmer>

                    <Image src='https://react.semantic-ui.com/images/wireframe/square-image.png' circular size='small' floated="right"/>

                    <Grid>
                    

                    <Grid.Column >

                    
                    
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
                        />

                        <Button color="olive" type="submit">Save</Button>
                    </Form>
                    {/* </Grid.Column>

                     <Grid.Column verticalAlign="top" width="4">
                    <Image src='https://react.semantic-ui.com/images/wireframe/square-image.png' circular size='small'/>*/}
                    </Grid.Column> 

                    </Grid> 
                    
                </Modal.Content>
            </Modal>
        </Fragment>
        );
    }
}