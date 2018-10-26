import React from 'react';
import { connect } from 'react-redux';

import { Menu, Icon, Form, Dimmer, Loader } from 'semantic-ui-react';

import * as modelActions from '../modelActions';

import logo from './logo.svg';
import ProvContractList from '../models/ProvContractList';
import {EditModalList, EditModalLeaf} from "../EditViews";

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

                <Menu.Item onClick={() => this.props.onDeploy()}>
                    <Dimmer active={this.props.deploy.loading}>
                        <Loader />
                    </Dimmer>
                    <Dimmer active={this.props.deploy.success}>
                        <Icon name="check" color="green" size="big" />
                    </Dimmer>
                    <Dimmer active={this.props.deploy.error}>
                        <Icon name="close" color="red" size="big" />
                    </Dimmer>
                    <Icon.Group size="big">
                        <Icon name="file alternate outline"/>
                        <Icon name="add" color="olive" corner/>
                    </Icon.Group>
                </Menu.Item>

                <Menu.Item onClick={() => this.props.onEdit()} disabled={!this.props.isContractSelected}>
                    <Dimmer active={this.props.edit.loading}>
                        <Loader />
                    </Dimmer>
                    {/* <Dimmer active={this.props.edit.success}>
                        <Icon name="check" color="green" size="big" />
                    </Dimmer> */}
                    <Dimmer active={this.props.edit.error}>
                        <Icon name="close" color="red" size="big" />
                    </Dimmer>
                    <Icon.Group size="big">
                        <Icon name="file alternate outline"/>
                        <Icon name="edit" color="blue" corner disabled={!this.props.isContractSelected}/>
                    </Icon.Group>
                </Menu.Item>

                <Menu.Item onClick={() => this.props.onAddTag()} disabled={!this.props.isContractSelected}>
                    {/* <Dimmer active={this.props.deploy.loading}>
                        <Loader />
                    </Dimmer>
                    <Dimmer active={this.props.deploy.success}>
                        <Icon name="check" color="green" size="big" />
                    </Dimmer>
                    <Dimmer active={this.props.deploy.error}>
                        <Icon name="close" color="red" size="big" />
                    </Dimmer> */}
                    <Icon.Group size="big">
                        <Icon name="file alternate outline"/>
                        <Icon name="tag" color="blue" corner disabled={!this.props.isContractSelected}/>
                    </Icon.Group>
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
                    </Menu.Item>
                </Menu.Menu>
            </Menu>
        );
    }
}

//container part
export const mapStateToProps = (state) => {
    let selected = ProvContractList.getSelectedContract(ProvContractList.getSelf(state));
    let editModal = EditModalList.getModal(state.editDetails, selected.getAddress());
    if(editModal === undefined) {
        editModal = new EditModalLeaf();
    }
    return {
        isContractSelected: ProvContractList.getSelf(state).isRootSelected(), 
        selectedContract: selected.getAddress(),
        deploy: {
            loading: state.deployment.isLoading(),
            success: state.deployment.isSuccess(),
            error: state.deployment.isError()
        },
        edit: {
            loading: editModal.isLoading()
        }
    };
}

export const mapDispatchToProps = (dispatch) => {
    return {
        searchSubmit: (address) => dispatch(modelActions.onContractSelect(address)),
        onDeploy: () => dispatch(modelActions.onDeployContractModalOpen(true)),
        onEdit: (selected) => dispatch(modelActions.onEditDetailsModalOpen(true, selected)),
        onAddTag: (selected) => dispatch(modelActions.onEditTagModalOpen(true, selected, "new")),
    };
}

export const mergeProps = (stateProps, dispatchProps, ownProps) => {
    return Object.assign({}, ownProps, stateProps, dispatchProps, {
        onEdit: () => dispatchProps.onEdit(stateProps.selectedContract),
        onAddTag: () => dispatchProps.onAddTag(stateProps.selectedContract)
    });
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(TopMenu);