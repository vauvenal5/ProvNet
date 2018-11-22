import React, {Fragment} from 'react';
import { connect } from 'react-redux';

import { 
    Modal,
    Button, 
    Icon,  
    Message, 
} from 'semantic-ui-react';
import {Form} from "formsy-semantic-ui-react";
import {withFormValidation, withDefaultBehavior} from "./imports";
import * as actions from "../actions";
import EditModel from '../../models/EditModel';
import { withDefaultDispatch, withDefaultMerge, modalPropsFrom, withDefaultMap } from '../EditModal/EditModal';
import BasicModalForm from "../EditModal/BasicModalForm";

export class DeployModal extends React.Component {

    constructor(props) {
        super(props);
        console.log(props);
        this.state = {
            title: "",
        };
    }

    onTitleChange = (title) => this.setState({title: title});

    onSubmit() {
        this.props.onSubmit(this.state.title);
    }

    render() {
        return(
            <Fragment>
            <BasicModalForm 
                {...modalPropsFrom(
                    this.props,
                    this.onSubmit.bind(this),
                    "Deploy new Provenance Contract",
                    {
                        header: 'You are about to deploy a new contract!',
                        msg: "This action will deploy a new SimpleProvenanceContract to the chain your MetaMask is connected to!" 
                    }
                )}
            >
                <Form.Group inline>
                    <Form.Input 
                        label="Contract Title"
                        name="title" 
                        onChange={(e, value) => 
                            this.onTitleChange(value.value)
                        }
                        placeholder="MyCompaniesContract"
                        required
                        value={this.state.title}
                    />
                    
                </Form.Group>
            </BasicModalForm>
            <Modal
                basic
                size="small"
                open={EditModel.isSuccess(this.props.editModel)}
            >
                <Modal.Content>
                    <Message
                        success
                        icon
                    >
                        <Icon name="check"/>
                        <Message.Content>
                            <Message.Header>Success!</Message.Header>
                            <p>
                                We successfully deployed your new contract under the following address: <b>{EditModel.getStateProps(this.props.editModel).address}</b>
                            </p>
                        </Message.Content>
                    </Message>
                    <Message
                        warning
                        icon="warning sign"
                        header="Save your contract address!"
                        content="We are currently not able to save the contract address for you. Copy it and save it somewhere!"
                    />
                </Modal.Content>
                <Modal.Actions>
                    <Button 
                        color='yellow' 
                        inverted 
                        onClick={this.props.onClear}
                    >
                        <Icon name='warning sign' /> Ok
                    </Button>
                </Modal.Actions>
            </Modal>
            </Fragment>
        );
    }
}

export const ValidatedDeployModal = withFormValidation(withDefaultBehavior(DeployModal));

export const mapDispatchToProps = (dispatch) => {
    return {
        onSubmit: (title) => dispatch(actions.onDeployContract(title)),
    };
}

export default connect(
    withDefaultMap, 
    (dispatch) => withDefaultDispatch(dispatch, mapDispatchToProps(dispatch)),
    withDefaultMerge
)(ValidatedDeployModal);