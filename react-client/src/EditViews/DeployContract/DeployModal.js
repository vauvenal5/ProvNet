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
import * as actions from "../actions";
import EditModelSelector from '../../models/selectors/EditModelSelector';
import EditModel from '../../models/EditModel';
import { withDefaultDispatch, withDefaultMerge } from '../EditModal/EditModal';

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
                {...this.props.defaultProps}
                header="Deploy new Provenance Contract" 
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
                        onClick={this.props.defaultProps.onClearResult}
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
        editModel: EditModelSelector.getNewContractModel(state),
        address: EditModelSelector.newContractKey,
    }
}

export const mapDispatchToProps = (dispatch) => {
    return withDefaultDispatch(dispatch, {
        onSubmit: (title) => dispatch(actions.onDeployContract(title)),
    });
}

export default connect(mapStateToProps, mapDispatchToProps, withDefaultMerge)(ValidatedDeployModal);