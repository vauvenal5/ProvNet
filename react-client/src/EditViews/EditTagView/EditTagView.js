import React, {Fragment} from 'react';
import { connect } from 'react-redux';

import {Form} from "formsy-semantic-ui-react";
import {modelActions, ProvContract, ProvContractList, Tag, EditModalWrapper, withFormValidation} from "./imports";
import EditModalTagList from './EditModalTagList';

export class EditTagView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            title: this.props.title
        }
    }

    render() {
        return(
            <EditModalWrapper 
                header="Add Tag" 
                defaultWarning 
                isOpen={this.props.isOpen} 
                onClose={this.props.onClose} 
                commitValid={this.props.valid}
            >
                <Form
                    onValid={this.props.onValid}
                    onInvalid={this.props.onInvalid}
                >                            
                    <Form.Group inline>
                        <Form.Input
                            label="Tag Title"
                            name="title"
                            placeholder="MyCompaniesTag"
                            required
                            value={this.state.title}
                        />
                    </Form.Group>
                </Form>
            </EditModalWrapper>
        );
    }
}

export const ValidatedEditTagView = withFormValidation(EditTagView);

export const mapStateToProps = (state) => {
    let contract = ProvContractList.getSelectedContract(ProvContractList.getSelf(state));
    let selectedModal = EditModalTagList.getSelected(state.editTag);
    let selectedTag = ProvContract.getTags(contract).getTag(EditModalTagList.getId(selectedModal));
    if(selectedTag === undefined) {
        selectedTag = new Tag("","");
    }
    return {
        isOpen: state.editTag.isOpen(),
        title: selectedTag.getTitle()
    }
}

export const mapDispatchToProps = (dispatch) => {
    return {
        onClose: () => dispatch(modelActions.onEditTagModalOpen(false)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ValidatedEditTagView);