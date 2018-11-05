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
import {modelActions, EditModalWrapper, withFormValidation, withDefaultProps} from "./imports";
import { EditModalLeaf } from '../EditModal';

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
        //this.props.onClose();
        //this.props.onDeploy(this.state.title);
    }

    render() {
        return(
            <Fragment>
            <EditModalWrapper 
                header="Deploy new Provenance Contract" 
                {...this.props.defaultProps}
                onCommit={this.onSubmit.bind(this)}
                // onClearResult={this.onClearResult.bind(this)}
            >
                <Message
                    warning
                    icon="warning sign"
                    header='You are about to deploy a new contract!'
                    content="This action will deploy a new SimpleProvenanceContract to the chain your MetaMask is connected to!"
                />
                <Form 
                    onValidSubmit={this.onSubmit.bind(this)}
                    {...this.props.formValidation}
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
                </Form>
            </EditModalWrapper>
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
                        onClick={this.props.onClearResult}
                    >
                        <Icon name='warning sign' /> Ok
                    </Button>
                </Modal.Actions>
            </Modal>
            </Fragment>
        );
    }
}

export const ValidatedDeployModal = withFormValidation(withDefaultProps(DeployModal));

export const mapStateToProps = (state) => {
    return {
        editModalLeaf: state.deployment,
        isOpen: state.deployment.isOpen(),
        success: state.deployment.isOpen() && state.deployment.isSuccess(),
        //loading: state.deployment.isLoading(),
        address: state.deployment.getAddress(),
        //error: state.deployment.isOpen() && state.deployment.isError(),
        //errorProps: EditModalLeaf.getStateProps(state.deployment),
    }
}

export const mapDispatchToProps = (dispatch) => {
    return {
        onClose: () => dispatch(modelActions.onDeployContractModalOpen(false)),
        onSubmit: (title) => dispatch(modelActions.onDeployContract(title)),
        onClear: () => dispatch(modelActions.onDeployContractModalClear())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ValidatedDeployModal);