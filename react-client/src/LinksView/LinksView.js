import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Grid, Header, Breadcrumb, Label, Table, Menu, Icon, Button } from 'semantic-ui-react';

import TagsView from '../TagsView';
import ContractForm from "../ContractForm";

//import * as actions from './actions';

export const LinksView = (props) => {
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
                            <Table.HeaderCell>Types</Table.HeaderCell>
                            <Table.HeaderCell>Actions</Table.HeaderCell>
                        </Table.Row>
                        </Table.Header>

                        <Table.Body>
                        <Table.Row>
                            <Table.Cell>
                                <Label as="a" ribbon color="red">0x232489739826493264</Label>
                            </Table.Cell>
                            <Table.Cell>
                                <Label circular color="red">
                                    Trusted<Icon name='close' />
                                </Label>
                                <Label circular color="yellow">
                                    Blablu<Icon name='close' />
                                </Label>
                            </Table.Cell>
                            <Table.Cell>
                                    <Button icon='info' content="Info" labelPosition='left'/>
                                    <Button icon='eye' content="Select" labelPosition='left'/>
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>
                                <Label as="a" ribbon basic>0x232489739826493278</Label>
                                </Table.Cell>
                            <Table.Cell>Cell</Table.Cell>
                            <Table.Cell>Cell</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell><Label as="a" ribbon>0x232489739826493278</Label></Table.Cell>
                            <Table.Cell>Cell</Table.Cell>
                            <Table.Cell>Cell</Table.Cell>
                        </Table.Row>
                        </Table.Body>
                    </Table>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
}

//container part
const mapStateToProps = (state) => {
    return {
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LinksView);