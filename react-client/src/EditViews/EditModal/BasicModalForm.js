import React from 'react';
import { connect } from 'react-redux';

import {Form} from "formsy-semantic-ui-react";
import { withDefaultProps } from '../withDefaultProps';
import { EditModal } from './EditModal';
import { withFormValidation } from '../withFormValidation';

export class BasicModalForm extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return(
            <EditModal 
                {...this.props.defaultProps}
                defaultWarning 
                onCommit={this.props.onSubmit}
            >
                <Form
                    onValidSubmit={this.props.onSubmit}
                    {...this.props.formValidation}
                >                            
                    {this.props.children}
                </Form>
            </EditModal>
        );
    }
}

export default withFormValidation(withDefaultProps(BasicModalForm));