import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Form, Label, Segment, Image, Container, Item } from 'semantic-ui-react';

//import * as actions from './actions';

//component part
export const ContractForm = (props) => {
    let url = props.imageUrl;
    if(url === undefined || url === "") {
        url = 'https://react.semantic-ui.com/images/wireframe/square-image.png';
    }
    console.log(url);

    return (
        <Item.Group>
            <Item>
                <Item.Image src={url} size='small' circular />

                <Item.Content>
                    <Item.Header>Description</Item.Header>
                    <Item.Description>
                        {props.description}
                    </Item.Description>
                </Item.Content>
            </Item>
        </Item.Group>
    );
}

export default ContractForm;