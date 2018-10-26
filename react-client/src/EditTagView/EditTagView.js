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
    Loader, 
    Dimmer
} from 'semantic-ui-react';
import {Form} from "formsy-semantic-ui-react";
import EditModal, {withFormValidation} from "../EditModal";
import * as modelActions from '../modelActions';
import ProvContract from '../models/ProvContract';
import ProvContractList from '../models/ProvContractList';
import EditModalTagList from './EditModalTagList';
import Tag from '../models/Tag';

export class EditTagView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            title: this.props.title
        }
    }

    render() {
        return(
            <EditModal 
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
            </EditModal>
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