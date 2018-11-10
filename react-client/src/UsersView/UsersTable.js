import React from 'react';
import { connect } from 'react-redux';
import { Table, TableCell, Button, Icon } from 'semantic-ui-react';
import TagView from "../TagView";
import { Tag, TagSelector } from '../models';
import { User } from '../models';
import { TagButton } from '../TagView/TagButton';
import SpecialRoleSelector from '../models/selectors/SpecialRoleSelector';
import SpecialRolesMap from './SpecialRolesMap';
import UsersMap from './UsersMap';
import TagsMap from '../models/maps/TagsMap';
import UserSelector from '../models/selectors/UserSelector';

export const UsersTable = ({
    specialRoles = new SpecialRolesMap(), 
    users = new UsersMap(), 
    tags = new TagsMap()
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
                    <Button icon="user plus"/>
                    <Button icon="tag"/>
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
    };
}

export default connect(mapStateToProps)(UsersTable);