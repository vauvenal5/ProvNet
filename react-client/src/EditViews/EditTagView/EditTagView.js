import React from 'react';
import { connect } from 'react-redux';

import {Form} from "formsy-semantic-ui-react";
import { EditModalWrapper, withFormValidation, SelectSelector, TagSelector} from "./imports";
import { withDefaultProps } from '../withDefaultProps';
import BasicModalForm from "../EditModal/BasicModalForm";

export default class EditTagView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            title: this.props.title
        }
    }

    setTitle(value) {
        this.setState({title: value});
    }

    onSubmit() {
        this.props.onSubmit(this.state.title);
    }

    render() {
        return(
            // <EditModalWrapper 
            //     {...this.props.defaultProps}
            //     defaultWarning 
            //     onCommit={this.onSubmit.bind(this)}
            // >
            //     <Form
            //         onValidSubmit={this.onSubmit.bind(this)}
            //         {...this.props.formValidation}
            //     >     
            <BasicModalForm {...this.props} onSubmit={this.onSubmit.bind(this)}>
                    <Form.Group inline>
                        <Form.Input
                            label={this.props.labelTitle}
                            name="title"
                            placeholder={this.props.labelTitle}
                            required
                            value={this.state.title}
                            onChange={(e, value) => this.setTitle(value.value)}
                        />
                    </Form.Group>
                    {this.props.children}
            </BasicModalForm>
            //     </Form>
            // </EditModalWrapper>
        );
    }
}

//export default withFormValidation(withDefaultProps(EditTagView));