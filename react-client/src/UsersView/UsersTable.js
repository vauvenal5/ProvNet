import React from 'react';
import { connect } from 'react-redux';
import { Table, TableCell, Button, Icon } from 'semantic-ui-react';
import TagView from "../TagView";
import { Tag, TagSelector, User, SpecialRoleSelector, TagsMap, UserSelector, SelectSelector } from '../models';
import { TagButton } from '../TagView/TagButton';
import SpecialRolesMap from './SpecialRolesMap';
import UsersMap from '../models/maps/UsersMap';
import * as selectActions from "../SelectReducer/actions";
import {editModelActions} from "../EditViews";
import EditModelSelector from '../models/selectors/EditModelSelector';
import EditModelMap from '../models/maps/EditModelMap';
import EditModel from '../models/EditModel';
import { ErrorIcon } from '../DefaultIcons/ErrorIcon';
import { SuccessIcon } from '../DefaultIcons/SuccessIcon';

export const UsersTable = ({
    specialRoles = new SpecialRolesMap(), 
    users = new UsersMap(), 
    tags = new TagsMap(),
    editModels = new EditModelMap(),
    onEditUser
}) => {
    let rows = users.mapToArray((address, user) => {
        let specialRolesView = User.getSpecialRoles(user).map(role => {
            let icon = (<Icon name='close' fitted/>);
            return (
                <TagButton tag={specialRoles.get(role)} icon={icon} childClick={() => console.log("click")} />
            );
        });

        if(User.isOwner(user)) {
            specialRolesView.unshift(<TagView tag={new Tag(undefined, "owner")} basic/>);
        }

        let roles = User.getRoles(user).map(role => {
            let icon = (<Icon name='close' fitted/>);
            return (
                <TagButton tag={tags.get(role)} icon={icon} childClick={() => console.log("click")} />
            );
        })

        let editModel = editModels.get(address);
        let editIcon = (<Icon name="tag"/>);
        
        if(EditModel.isError(editModel)) {
            editIcon = (<ErrorIcon/>)
        }

        if(EditModel.isSuccess(editModel)) {
            editIcon = (<SuccessIcon/>);
        }

        return (
            <Table.Row>
                <TableCell>{address}</TableCell>
                <TableCell>
                    {specialRolesView}
                </TableCell>
                <TableCell>
                    {roles}
                </TableCell>
                <TableCell>
                    <Button icon={editIcon} onClick={() => onEditUser(address)} loading={EditModel.isLoading(editModel)}/>
                </TableCell>
            </Table.Row>
        );
    });

    return (
        <Table selectable>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Address</Table.HeaderCell>
                    <Table.HeaderCell>Special Rights</Table.HeaderCell>
                    <Table.HeaderCell>Link Rights</Table.HeaderCell>
                    <Table.HeaderCell>Actions</Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {rows}
            </Table.Body>
        </Table>
    );
}

//container part
export const mapStateToProps = (state) => {
    return {
        specialRoles: SpecialRoleSelector.getContractSelected(state),
        users: UserSelector.getContractSelected(state),
        tags: TagSelector.getContractSelected(state),
        address: SelectSelector.getSelectedContract(state),
        editModels: EditModelSelector.getContractSelected(state)
    };
}

export const mapDispatchToProps = (dispatch) => {
    return {
        onEditUser: (address, id) => dispatch(editModelActions.onEditUserModalOpen(true, address, id))
    };
}

export const mergeProps = (stateProps, dispatchProps, ownProps) => {
    return Object.assign(stateProps, dispatchProps, ownProps, {
        onEditUser: (id) => dispatchProps.onEditUser(stateProps.address, id)
    });
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(UsersTable);