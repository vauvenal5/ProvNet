import React from 'react';
import { connect } from 'react-redux';

import { Table } from 'semantic-ui-react';

import LinkRow from '../LinkRow';
import Select from '../models/Select';
import { RootSelector } from '../models';
import { ProvContractList } from '../models';
import MapModel from '../models/MapModel';

export const LinksTable = ({tags, links}) => {

    let linkRows = [];
    for(let key in links) {
        let link = links[key];
        linkRows.push(
            <LinkRow key={link.address} types={tags} link={link} />
        );
    }

    return (
        <Table singleLine selectable>
            <Table.Header>
            <Table.Row>
                <Table.HeaderCell>Address</Table.HeaderCell>
                <Table.HeaderCell>Title</Table.HeaderCell>
                <Table.HeaderCell>Types</Table.HeaderCell>
                <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
            </Table.Header>

            <Table.Body>
                {linkRows}
            </Table.Body>
        </Table>
    );
}

//container part
export const mapStateToProps = (state) => {
    let linkAddress = Select.getLinkSelectedContract(RootSelector.getSelect(state));
    let contract = ProvContractList.getContract(RootSelector.getContracts(state), linkAddress);
    return {
        tags: MapModel.getItems(MapModel.get(RootSelector.getTags(state), linkAddress)),
        links: MapModel.getItems(MapModel.get(RootSelector.getLinks(state), linkAddress))
    };
}

export default connect(mapStateToProps)(LinksTable);