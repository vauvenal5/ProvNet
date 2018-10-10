import React from 'react';
import { connect } from 'react-redux';

import { Grid, Header, Table } from 'semantic-ui-react';

import LinkRow from '../LinkRow';
import LinkNav from '../LinkNav';
import ProvContractList from "../models/ProvContractList";
import ProvContract from "../models/ProvContract";
import LinkList from "../models/LinkList";

export const LinksView = ({tags, links}) => {

    let linkRows = [];
    for(let key in links) {
        let link = links[key];
        linkRows.push(
            <LinkRow key={link.address} types={tags} link={link} />
        );
    }

    return (
        <Grid padded>
            <Grid.Row>
                <Grid.Column>
                    <Header as="h2" dividing>
                        Links
                    </Header>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column>
                    <LinkNav/>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column>
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
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
}

//container part
export const mapStateToProps = (state) => {
    let contract = state.contracts.getLinkSelectedContract();
    return {
        tags: contract.getTags(),
        links: contract.getLinks().asArray()
    };
}

export default connect(mapStateToProps)(LinksView);