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
import EditModal, {withFormValidation} from "../EditModal";
import * as modelActions from '../modelActions';

export class DeployModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            title: "",
        };
    }

    onTitleChange = (title) => this.setState({title: title});

    onSubmit() {
        this.props.onClose();
        this.props.onDeploy(this.state.title);
    }

    onClearResult() {
        //this.onTitleChange("");
        this.props.onClose();
        this.props.onClear();
    }

    render() {
        return(
            <Fragment>
            <EditModal 
                header="Deploy new Provenance Contract" 
                isOpen={this.props.isOpen}
                onClose={this.props.onClose}
                commitValid={this.props.valid}
                onCommit={this.onSubmit.bind(this)}
                
                {...this.props.error}
                onClearResult={this.onClearResult.bind(this)}
            >
                <Message
                    warning
                    icon="warning sign"
                    header='You are about to deploy a new contract!'
                    content="This action will deploy a new SimpleProvenanceContract to the chain your MetaMask is connected to!"
                />
                    <Form 
                        onValidSubmit={this.onSubmit.bind(this)}
                        onValid={this.props.onValid}
                        onInvalid={this.props.onInvalid}>
                        
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
                    </Form>
            </EditModal>
            <Modal
                basic
                size="small"
                open={this.props.success}
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
                                We successfully deployed your new contract under the following address: <b>{this.props.address}</b>
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
                        onClick={this.onClearResult.bind(this)}
                    >
                        <Icon name='warning sign' /> Ok
                    </Button>
                </Modal.Actions>
            </Modal>
            </Fragment>
        );
    }
}

export const ValidatedDeployModal = withFormValidation(DeployModal);

export const mapStateToProps = (state) => {
    return {
        isOpen: state.deployment.isOpen(),
        success: state.deployment.isOpen() && state.deployment.isSuccess(),
        loading: state.deployment.isLoading(),
        address: state.deployment.getAddress(),
        error: {
            error: state.deployment.isOpen() && state.deployment.isError(),
            errorHeader: "Contract deployment failed!",
            errorMessage: "We were not able to deploy your contract.",
        }
    }
}

export const mapDispatchToProps = (dispatch) => {
    return {
        onClose: () => dispatch(modelActions.onDeployContractModalOpen(false)),
        onDeploy: (title) => dispatch(modelActions.onDeployContract(title)),
        onClear: () => dispatch(modelActions.onDeployContractModalClear())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ValidatedDeployModal);