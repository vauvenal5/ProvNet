import React from 'react';
import { connect } from 'react-redux';

import { Grid, Header, Breadcrumb, Label, Table, Button } from 'semantic-ui-react';

import ProvContract from "../models/ProvContract";

export const LinksView = ({selected, contract}) => {
    
    let links = contract.links.map((link, index) => {
        let tags = link.tags.map((tagId, index) => 
            <Label 
                key={tagId} 
                circular 
                color={contract.types[tagId].getColor()}
            >
                {contract.types[tagId].getTitle()}
            </Label>
        );

        return (
            <Table.Row key={index}>
                <Table.Cell>
                    <Label as="a" ribbon>{link.address}</Label>
                </Table.Cell>
                <Table.Cell>{link.title}</Table.Cell>
                <Table.Cell>
                    {tags}
                </Table.Cell>
                <Table.Cell>
                        <Button icon='info' content="Info" labelPosition='left'/>
                        <Button icon='eye' content="Select" labelPosition='left'/>
                </Table.Cell>
            </Table.Row>
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
const mapStateToProps = (state) => {
    let selected = state.contracts.selected[0];
    return {
        selected: selected,
        contract: selectedContract(state.contracts, selected)
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LinksView);