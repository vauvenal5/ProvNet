import React from 'react';
import { connect } from 'react-redux';

import { Table, Label, TableCell, Segment, Button, Icon, Container } from 'semantic-ui-react';

import LinkRow from '../LinkRow';
import { Input } from 'formsy-semantic-ui-react';
import TagView from "../TagView";
import { Tag, ProvContractList, ProvContract } from '../models';
import reducer from "./reducer";
import Select from '../models/Select';
import { RootSelector, User } from '../models';
import MapModel from '../models/MapModel';
import { TagButton } from '../TagView/TagButton';

export const UsersTable = (props) => {

    let rows = [];
    for(let userKey in props.users) {
        let user = props.users[userKey];

        let specialRoles = User.getSpecialRoles(user).map(role => {
            let icon = (<Icon name='close' fitted/>);
            return (
                <TagButton tag={props.specialRoles[role]} icon={icon} childClick={() => console.log("click")} />
            );
        });

        if(User.isOwner(user)) {
            specialRoles.unshift(<TagView tag={new Tag(undefined, "owner")} basic/>);
        }

        let roles = User.getRoles(user).map(role => {
            let icon = (<Icon name='close' fitted/>);
            return (
                <TagButton tag={props.tags[role]} icon={icon} childClick={() => console.log("click")} />
            );
        })

        rows.push(
            <Table.Row>
                <TableCell>{User.getAddress(user)}</TableCell>
                <TableCell>
                    {specialRoles}
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
    }

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
    let contract = Select.getSelectedContract(RootSelector.getSelect(state));
    return {
        specialRoles: MapModel.getItems(RootSelector.getSpecialRoles(state)),
        users: MapModel.getItems(RootSelector.getUsers(state)),
        tags: MapModel.getItems(MapModel.get(RootSelector.getTags(state), contract))
    };
}

export default connect(mapStateToProps)(UsersTable);