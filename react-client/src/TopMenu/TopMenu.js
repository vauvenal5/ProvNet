import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Menu, Input, Image, Icon, Form } from 'semantic-ui-react';

import * as actions from './actions';

import logo from './logo.svg';

var onClick = (a) => {
    console.log("test: "+a);
};

//component part
class TopMenu extends Component {
    propTypes = {
        activeItem: PropTypes.string.isRequired,
        handleItemClick: PropTypes.func.isRequired
    }

    handleChange = (e, { name, value }) => this.setState({ [name]: value });

    onSubmit = () => this.props.searchSubmit(this.state.address);

    render() {
        const {activeItem, handleItemClick} = this.props;

        return (
            <Menu stackable>
                <Menu.Item>
                    <img src={logo} />
                </Menu.Item>
    
                <Menu.Item 
                    name='features'
                    active={activeItem === 'features'}
                    onClick={handleItemClick}
                >
                    Features
                </Menu.Item>
    
                <Menu.Item
                    name='testimonials'
                    active={activeItem === 'testimonials'} 
                    onClick={handleItemClick}
                >
                    Testimonials
                </Menu.Item>
    
                <Menu.Item 
                    name='sign-in' 
                    active={activeItem === 'sign-in'} 
                    onClick={handleItemClick}
                >
                    Sign-in
                </Menu.Item>
    
                <Menu.Menu position="right">
                    <Menu.Item>
                        <Form onSubmit={this.onSubmit}>
                            <Form.Input 
                            name="address" 
                            onChange={this.handleChange}
                            icon={
                                <Icon name='search' inverted circular link onClick={this.onSubmit} />
                            } 
                            placeholder='Contract Address...'>
                            </Form.Input>
                        </Form>
                        {/* <Input 
                        icon={<Icon name='search' inverted circular link onClick={() => onClick("asd")} />} 
                        placeholder='Contract Address...' 
                        // action={{ icon: 'search', onClick: onClick }}
                        /> */}
                    </Menu.Item>
                    <Menu.Item>
                    <Image src='https://react.semantic-ui.com/images/avatar/small/ade.jpg' avatar />
                    </Menu.Item>
                </Menu.Menu>
            </Menu>
        );
    }
}



//container part
const mapStateToProps = (state) => {
    return {
        activeItem: state["topMenu"].activeItem,
        address: state["topMenu"].address,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        handleItemClick: (e, {name}) => dispatch(actions.onClick(name)),
        searchSubmit: (address) => dispatch(actions.onSearchAddress(address)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(TopMenu);