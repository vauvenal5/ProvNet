import React from 'react';

import {Form} from "formsy-semantic-ui-react";
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
        );
    }
}