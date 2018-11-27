import React from 'react';
import { connect } from 'react-redux';

import {Form} from "formsy-semantic-ui-react";
import { withDefaultBehavior } from '../withDefaultBehavior';
import { EditModal, modalPropsFrom } from './EditModal';
import { withFormValidation } from '../withFormValidation';

export class BasicModalForm extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return(
            <EditModal 
                {...modalPropsFrom(
                    this.props,
                    this.props.onSubmit,
                    this.props.header,
                    this.props.warning
                )}
                submitButton={true}
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

export default withFormValidation(withDefaultBehavior(BasicModalForm));