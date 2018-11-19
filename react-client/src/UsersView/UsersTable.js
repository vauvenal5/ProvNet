import React from 'react';
import { connect } from 'react-redux';
import { Table, TableCell, Button, Icon } from 'semantic-ui-react';
import TagView from "../TagView";
import { Tag, TagSelector, User, SpecialRoleSelector, TagsMap, UserSelector, SelectSelector } from '../models';
import { TagButton } from '../TagView/TagButton';
import SpecialRolesMap from './SpecialRolesMap';
import UsersMap from '../models/maps/UsersMap';
import * as selectActions from "../SelectReducer/actions";

export const UsersTable = ({
    specialRoles = new SpecialRolesMap(), 
    users = new UsersMap(), 
    tags = new TagsMap(),
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
                    <Button icon="tag" onClick={() => onEditUser(address)}/>
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
        address: SelectSelector.getSelectedContract(state)
    };
}

export const mapDispatchToProps = (dispatch) => {
    return {
        onEditUser: (address, id) => dispatch(selectActions.onEditUserSelect(address, id, true))
    };
}

export const mergeProps = (stateProps, dispatchProps, ownProps) => {
    return Object.assign(stateProps, dispatchProps, ownProps, {
        onEditUser: (id) => dispatchProps.onEditUser(stateProps.address, id)
    });
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(UsersTable);