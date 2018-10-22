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
        this.onTitleChange("");
        this.props.onClose();
        this.props.onClear();
    }

    render() {
        return(
            <Fragment>
            <Modal
                on='click'
                open={this.props.isOpen}
                onClose={this.props.onClose}
                closeIcon
                size="small"
            >
                <Modal.Header>
                    Deploy new Provenance Contract
                </Modal.Header>
                <Modal.Content>
                    <Dimmer active={this.props.loading}>
                        <Loader size="big" content="Deploying..."/>
                    </Dimmer>
                    
                    <Form 
                        warning 
                        onValidSubmit={this.onSubmit.bind(this)}
                        onValid={() => this.setState({valid: true})}
                        onInvalid={() => this.setState({valid: false})}>
                        <Message
                            warning
                            icon="warning sign"
                            header='You are about to deploy a new contract!'
                            content="This action will deploy a new SimpleProvenanceContract to the chain your MetaMask is connected to!"
                        />
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
                </Modal.Content>
                <Modal.Actions>
                    <Button color="olive" disabled={!this.state.valid} onClick={this.onSubmit.bind(this)}>Deploy</Button>
                </Modal.Actions>
            </Modal>
            <Modal
                basic
                size="small"
                open={this.props.isOpen && this.props.success}
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
            <Modal
                basic
                size="small"
                open={this.props.isOpen && this.props.failure}
            >
                <Modal.Content>
                    <Message
                        error
                        icon
                    >
                        <Icon name="frown outline"/>
                        <Message.Content>
                            <Message.Header>Contract deployment failed!</Message.Header>
                            <p>
                                We were not able to deploy your contract. Possible steps:
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
                        onClick={this.onClearResult.bind(this)}
                    >
                        <Icon name='close' /> Close
                    </Button>
                </Modal.Actions>
            </Modal>
            </Fragment>
        );
    }
}

export const mapStateToProps = (state) => {
    return {
        isOpen: state.deployment.isOpen(),
        failure: state.deployment.isError(),
        success: state.deployment.isSuccess(),
        loading: state.deployment.isLoading(),
        address: state.deployment.getAddress()
    }
}

export const mapDispatchToProps = (dispatch) => {
    return {
        onClose: () => dispatch(modelActions.onDeployContractModalOpen(false)),
        onDeploy: (title) => dispatch(modelActions.onDeployContract(title)),
        onClear: () => dispatch(modelActions.onDeployContractModalClear())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DeployModal);