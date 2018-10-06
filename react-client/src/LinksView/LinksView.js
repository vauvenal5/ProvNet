import React from 'react';
import { connect } from 'react-redux';

import { Grid, Header, Breadcrumb, Label, Table } from 'semantic-ui-react';

import ProvContract from "../models/ProvContract";
import LinkRow from '../LinkRow';

export const LinksView = ({selected, contract}) => {
    
    let links = contract.links.map((link, index) => {
        return (
            <LinkRow key={link.address} types={contract.types} link={link} />
        );
    });

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
                    <Breadcrumb>
                        <Breadcrumb.Section>
                            <Label as='a' color="red">Selected</Label>
                        </Breadcrumb.Section>
                        <Breadcrumb.Divider icon='right chevron' />
                        <Breadcrumb.Section>
                            <Label as='a' color="blue">InfoSys</Label>
                        </Breadcrumb.Section>
                        <Breadcrumb.Divider icon='right chevron' />
                        <Breadcrumb.Section>
                            <Label as='a' color="green" active>Current</Label>
                        </Breadcrumb.Section>
                    </Breadcrumb>
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
                            {links}
                        </Table.Body>
                    </Table>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
}

//todo-sv: this is the same code as in DetailsView... selected should maybe be elevated
const selectedContract = (contracts, selected) => {
    if(selected === undefined) {
        return new ProvContract(selected);
    }
    return contracts[selected];
}

//container part
export const mapStateToProps = (state) => {
    let selected = state.contracts.selected[0];
    return {
        selected: selected,
        contract: selectedContract(state.contracts, selected)
    };
}

export default connect(mapStateToProps)(LinksView);