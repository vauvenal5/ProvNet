import React, {Fragment} from 'react';
import { connect } from 'react-redux';

import {  
    Image, 
    Grid
} from 'semantic-ui-react';
import {Form} from "formsy-semantic-ui-react";
import * as actions from "./actions";
import { 
    ProvContractList, 
    ContractDetails, 
    ProvContract, 
    modelActions, 
    withDefaultImage, 
    EditModalList, 
    EditModalWrapper, 
    withFormValidation 
} from "./imports";
import { withDefaultProps } from '../withDefaultProps';
import { EditModalLeaf } from '../EditModal';


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
        this.props.onSubmit(this.props.address, this.state.title, this.state.desc, this.state.imageUrl);
    }

    render() {
        return(
            <EditModalWrapper 
                header="Edit Contract Details" 
                defaultWarning 
                {...this.props.defaultProps}
                onCommit={this.onSubmit.bind(this)}
            >
                <Grid stackable>
                    <Grid.Column width="4" verticalAlign="middle">
                        <Image src={this.state.imageUrl} centered circular size='small'/>
                    </Grid.Column>
                    <Grid.Column width="12">
                        <Form
                            onValidSubmit={this.onSubmit.bind(this)}
                            {...this.props.formValidation}
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
            </EditModalWrapper>
        );
    }
}

export const ValidatedEditDetailsView = withFormValidation(withDefaultProps(withDefaultImage(EditDetailsView)));

export const mapStateToProps = (state, ownProps) => {
    //todo-sv: change first input to RootState.getProvContractList(state)
    let contract = ProvContractList.getSelectedContract(ProvContractList.getSelf(state));
    let address = ProvContract.getAddress(contract);
    let details = ProvContract.getDetails(contract);
    let modal = EditModalList.getModal(state.editDetails, address);
    return {
        editModalLeaf: modal,
        isOpen: state.editDetails.isOpen(),
        //loading: EditModalList.getModal(state.editDetails, address).isLoading(),
        address: address,
        title: ContractDetails.getTitle(details),
        desc: ContractDetails.getDescription(details),
        imageUrl: ContractDetails.getLogoUrl(details),
        //error: modal.isError(),
        //errorProps: EditModalLeaf.getStateProps(modal),
    }
}

export const mapDispatchToProps = (dispatch) => {
    return {
        onClose: () => dispatch(modelActions.onEditDetailsModalOpen(false)),
        onSubmit: (address, title, desc, url) => dispatch(actions.onEditDetails(address, title, desc, url)),
        onClear: (address) => dispatch(actions.onEditDetailsModalClear(address))
    }
}

export const mergeProps = (stateProps, dispatchProps, ownProps) => {
    return Object.assign({}, ownProps, stateProps, dispatchProps, {
        onClear: () => dispatchProps.onClear(stateProps.address)
    });
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ValidatedEditDetailsView);