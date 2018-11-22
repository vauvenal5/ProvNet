import React from 'react';
import { connect } from 'react-redux';

import { Menu, Icon, Form } from 'semantic-ui-react';

import * as modelActions from '../modelActions';
import {editModelActions} from "../EditViews";

import logo from './logo.svg';
import { SelectSelector } from '../models';
import { FancyButtonItem } from './FancyButtonItem';
import EditModelSelector from '../models/selectors/EditModelSelector';

export class TopMenu extends React.Component{
    
    constructor(props) {
        super(props);
    }
    
    handleChange = (e, { name, value }) => this.setState({
        address: value
    });

    onSubmit = () => this.props.searchSubmit(this.state.address);

    render() {
        return (
            <Menu stackable icon>
                <Menu.Item>
                    <img src={logo} />
                </Menu.Item>

                <FancyButtonItem 
                    icon="file alternate outline" 
                    childIcon="add" 
                    editModel={this.props.deploy}
                    onClick={this.props.onDeploy}
                />

                <FancyButtonItem 
                    icon="file alternate outline" 
                    childIcon="edit" 
                    editModel={this.props.edit}
                    onClick={this.props.onEdit}
                    disabled={!this.props.isContractSelected}
                />

                <FancyButtonItem 
                    icon="file alternate outline" 
                    childIcon="tag" 
                    onClick={this.props.onAddTag}
                    disabled={!this.props.isContractSelected}
                />

                <FancyButtonItem 
                    icon="file alternate outline" 
                    childIcon="user"
                    editModel={this.props.user}
                    onClick={this.props.onAddUser}
                    disabled={!this.props.isContractSelected}
                />

                <FancyButtonItem 
                    icon="file alternate outline" 
                    childIcon="linkify"
                    editModel={this.props.link}
                    onClick={this.props.onAddLink}
                    disabled={!this.props.isContractSelected}
                />

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
                    </Menu.Item>
                </Menu.Menu>
            </Menu>
        );
    }
}

//container part
export const mapStateToProps = (state) => {
    return {
        isContractSelected: SelectSelector.isContractSelected(state), 
        selectedContract: SelectSelector.getSelectedContract(state),
        deploy: EditModelSelector.getNewContractModel(state),
        edit: EditModelSelector.getContractDetailsModel(state),
        user: EditModelSelector.getUserAddModel(state),
        link: EditModelSelector.getLinkAddModel(state)
    };
}

export const mapDispatchToProps = (dispatch) => {
    return {
        searchSubmit: (address) => dispatch(modelActions.onContractSelect(address)),
        onDeploy: () => dispatch(editModelActions.onDeployContractOpen(true)),
        onEdit: (selected) => dispatch(editModelActions.onEditDetailsModalOpen(true, selected)),
        onAddTag: (selected) => dispatch(editModelActions.onEditTagModalOpen(true, selected, EditModelSelector.tagKey)),
        onAddUser: (selected) => dispatch(
            editModelActions.onEditUserModalOpen(
                true, selected, EditModelSelector.userKey,
            )
        ),
        onAddLink: (selected) => dispatch(
            editModelActions.onEditLinkModalOpen(
                true, selected, EditModelSelector.linkKey
            )
        )
    };
}

export const mergeProps = (stateProps, dispatchProps, ownProps) => {
    return Object.assign({}, ownProps, stateProps, dispatchProps, {
        onEdit: () => dispatchProps.onEdit(stateProps.selectedContract),
        onAddTag: () => dispatchProps.onAddTag(stateProps.selectedContract),
        onAddUser: () => dispatchProps.onAddUser(stateProps.selectedContract),
        onAddLink: () => dispatchProps.onAddLink(stateProps.selectedContract)
    });
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(TopMenu);