import React from 'react';
import { connect } from 'react-redux';

import { Menu, Icon, Form } from 'semantic-ui-react';

import * as modelActions from '../modelActions';

import logo from './logo.svg';
import {EditModalList, EditModalLeaf, editTagActions } from "../EditViews";
import { SelectSelector } from '../models';
import { FancyButtonItem } from './FancyButtonItem';

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
                    success={this.props.deploy.success} 
                    error={this.props.deploy.error} 
                    loading={this.props.deploy.loading}
                    onClick={this.props.onDeploy}
                />

                <FancyButtonItem 
                    icon="file alternate outline" 
                    childIcon="edit" 
                    success={this.props.edit.success} 
                    error={this.props.edit.error} 
                    loading={this.props.edit.loading}
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
                    icon="user outline" 
                    childIcon="add"
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
    let address = SelectSelector.getSelectedContract(state);
    let editModal = EditModalList.getModal(state.editDetails, address);
    if(editModal === undefined) {
        editModal = new EditModalLeaf();
    }
    return {
        isContractSelected: SelectSelector.isContractSelected(state), 
        selectedContract: address,
        deploy: {
            loading: state.deployment.isLoading(),
            success: state.deployment.isSuccess(),
            error: state.deployment.isError()
        },
        edit: {
            loading: editModal.isLoading(),
            error: editModal.isError(),
            success: editModal.isSuccess()
        }
    };
}

export const mapDispatchToProps = (dispatch) => {
    return {
        searchSubmit: (address) => dispatch(modelActions.onContractSelect(address)),
        onDeploy: () => dispatch(modelActions.onDeployContractModalOpen(true)),
        onEdit: (selected) => dispatch(modelActions.onEditDetailsModalOpen(true, selected)),
        onAddTag: (selected) => dispatch(editTagActions.onEditTagModalOpen(true, selected, "new")),
    };
}

export const mergeProps = (stateProps, dispatchProps, ownProps) => {
    return Object.assign({}, ownProps, stateProps, dispatchProps, {
        onEdit: () => dispatchProps.onEdit(stateProps.selectedContract),
        onAddTag: () => dispatchProps.onAddTag(stateProps.selectedContract)
    });
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(TopMenu);