import React, {Fragment} from 'react';
import { connect } from 'react-redux';

import {  
    Image, 
    Grid
} from 'semantic-ui-react';
import {Form} from "formsy-semantic-ui-react";
import * as actions from "../actions";
import { 
    ContractDetails, 
    ProvContract, 
    withDefaultImage, 
    EditModalWrapper, 
    withFormValidation 
} from "./imports";
import { withDefaultBehavior } from '../withDefaultBehavior';
import {ProvContractSelector, SelectSelector} from '../../models';
import EditModelSelector from '../../models/selectors/EditModelSelector';
import { withDefaultDispatch, withDefaultMerge, modalPropsFrom, withDefaultMap } from '../EditModal/EditModal';
import { connectWithDefault } from '../connectWithDefault';


export class EditDetailsView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            title: ContractDetails.getTitle(this.props.details),
            desc: ContractDetails.getDescription(this.props.details),
            imageUrl: ContractDetails.getLogoUrl(this.props.details),
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
        this.props.onSubmit(this.state.title, this.state.desc, this.state.imageUrl);
    }

    render() {
        return(
            <EditModalWrapper 
                {...modalPropsFrom(
                    this.props, 
                    this.onSubmit.bind(this),
                    "Edit Contract Details"
                )}
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

export const ValidatedEditDetailsView = withFormValidation(withDefaultBehavior(withDefaultImage(EditDetailsView)));

export const mapStateToProps = (state, ownProps) => {
    let contract = ProvContractSelector.getSelected(state);
    let details = ProvContract.getDetails(contract);
    return {
        details: details
    };
}

export const mapDispatchToProps = (dispatch) => {
    return {
        onSubmit: (address, title, desc, url, origDetails) => dispatch(actions.onEditDetails(address, title, desc, url, origDetails)),
    };
}

export const mergeProps = (stateProps, dispatchProps, ownProps) => {
    return {
        onSubmit: (title, desc, url) => dispatchProps.onSubmit(stateProps.address, title, desc, url, stateProps.details),
    };
}

export default connectWithDefault(mapStateToProps, mapDispatchToProps, mergeProps)(ValidatedEditDetailsView);