import React from 'react';
import { connect } from 'react-redux';

import { Table } from 'semantic-ui-react';

import LinkRow from '../LinkRow';
import Select from '../models/Select';
import { RootSelector } from '../models';
import { ProvContractList } from '../models';
import ListModel from '../models/ListModel';

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
        tags: ListModel.getItems(ListModel.get(RootSelector.getTags(state), linkAddress)),
        links: contract.getLinks().asArray()
    };
}

export default connect(mapStateToProps)(LinksTable);