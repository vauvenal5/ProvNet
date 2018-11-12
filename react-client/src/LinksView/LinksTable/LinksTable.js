import React from 'react';
import { connect } from 'react-redux';

import { Table } from 'semantic-ui-react';

import LinkRow from './LinkRow';
import { TagSelector, LinkSelector, LinkMap, TagsMap } from '../../models';

export const LinksTable = ({tags = new TagsMap(), links = new LinkMap()}) => {

    let linkRows = links.mapToArray((key, link) => {
        return (
            <LinkRow key={link.address} types={tags.getItems()} link={link} />
        );
    });

    // let linkRows = [];
    // for(let key in links) {
    //     let link = links[key];
    //     linkRows.push(
    //         <LinkRow key={link.address} types={tags} link={link} />
    //     );
    // }

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
    return {
        tags: TagSelector.getLinkSelected(state),
        links: LinkSelector.getLinkSelectedLinks(state)
        //links: MapModel.getItems(MapModel.get(RootSelector.getLinks(state), linkAddress))
    };
}

export default connect(mapStateToProps)(LinksTable);