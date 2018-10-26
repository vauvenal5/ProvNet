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
    Label, 
    Dimmer
} from 'semantic-ui-react';
import {Form} from "formsy-semantic-ui-react";
import EditModal, {withFormValidation} from "../EditModal";
import * as modelActions from '../modelActions';
import * as actions from "./actions";
import ProvContractList from '../models/ProvContractList';
import ContractDetails from '../models/ContractDetails';
import ProvContract from '../models/ProvContract';
import EditModalList from "../EditModal/EditModalList";
import {withDefaultImage} from "../withDefaultImage";

export class EditDetailsView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            title: this.props.title,
            imageUrl: this.props.imageUrl,
            desc: this.props.desc
        }
    }

    onTitleChange(value) {
        this.setState({title: value});
    }

    onUrlChange(value) {
        this.setState({imageUrl: value});
    }

    onDescChange(value) {
        this.setState({desc: value});
    }

    onSubmit() {
        this.props.onClose();
        this.props.onEdit(this.props.address, this.state.title, this.state.desc, this.state.imageUrl);
    }

    render() {
        return(
            <EditModal 
                header="Edit Contract Details" 
                defaultWarning 
                isOpen={this.props.isOpen} 
                onClose={this.props.onClose}
                commitValid={this.props.valid}
                onCommit={this.onSubmit.bind(this)}
            >
                <Grid stackable>
                    <Grid.Column width="4" verticalAlign="middle">
                        <Image src={this.state.imageUrl} centered circular size='small'/>
                    </Grid.Column>
                    <Grid.Column width="12">
                        <Form
                            onValidSubmit={this.onSubmit.bind(this)}
                            onValid={this.props.onValid}
                            onInvalid={this.props.onInvalid}
                        >                            
                            <Form.Group widths="equal">
                                <Form.Input
                                    label="Contract Title"
                                    name="title"
                                    placeholder="MyCompaniesTitle"
                                    required
                                    value={this.state.title}
                                    onChange={(e, value) => 
                                        this.onTitleChange(value.value)
                                    }
                                />
                            
                                <Form.Input
                                    label="Contract Logo URL"
                                    name="link"
                                    placeholder="MyCompaniesImageURL"
                                    value={this.state.imageUrl}
                                    validations="isUrl"
                                    onChange={(e, value) => 
                                        this.onUrlChange(value.value)
                                    }
                                />
                            </Form.Group>
                            
                            <Form.TextArea 
                                label="Contract Description"
                                name="desc"
                                placeholder="Write here a short description of your contract."
                                value={this.state.desc}
                                style={{ minHeight: 90 }}
                                onChange={(e, value) => 
                                    this.onDescChange(value.value)
                                }
                            />
                        </Form>
                    </Grid.Column> 
                </Grid>
            </EditModal>
        );
    }
}

export const ValidatedEditDetailsView = withFormValidation(withDefaultImage(EditDetailsView));

export const mapStateToProps = (state, ownProps) => {
    //todo-sv: change first input to RootState.getProvContractList(state)
    let contract = ProvContractList.getSelectedContract(ProvContractList.getSelf(state));
    let address = ProvContract.getAddress(contract);
    let details = ProvContract.getDetails(contract);
    return {
        isOpen: state.editDetails.isOpen(),
        loading: EditModalList.getModal(state.editDetails, address).isLoading(),
        address: address,
        title: ContractDetails.getTitle(details),
        desc: ContractDetails.getDescription(details),
        imageUrl: ContractDetails.getLogoUrl(details),
    }
}

export const mapDispatchToProps = (dispatch) => {
    return {
        onClose: () => dispatch(modelActions.onEditDetailsModalOpen(false)),
        onEdit: (address, title, desc, url) => dispatch(actions.onEditDetails(address, title, desc, url))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ValidatedEditDetailsView);