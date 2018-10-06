import React from 'react';
import { connect } from 'react-redux';

import { Menu, Icon, Form } from 'semantic-ui-react';

import * as actions from './actions';

import logo from './logo.svg';

export const TopMenu = ({address = "", searchSubmit}) => {

    const handleChange = (e, { name, value }) => {
        address = value;
    };

    const onSubmit = () => searchSubmit(address);

    return (
        <Menu stackable>
            <Menu.Item>
                <img src={logo} />
            </Menu.Item>

            <Menu.Menu position="right">
                <Menu.Item>
                    <Form onSubmit={onSubmit}>
                        <Form.Input 
                        name="address" 
                        onChange={handleChange}
                        icon={
                            <Icon name='search' inverted circular link onClick={onSubmit} />
                        } 
                        placeholder='Contract Address...'>
                        </Form.Input>
                    </Form>
                </Menu.Item>
            </Menu.Menu>
        </Menu>
    );
}

//container part
export const mapStateToProps = (state) => {
    return {
        address: state["topMenu"].address,
    };
}

export const mapDispatchToProps = (dispatch) => {
    return {
        searchSubmit: (address) => dispatch(actions.onSearchAddress(address)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(TopMenu);