import React from 'react';
import { connect } from 'react-redux';

import { Table, Label, TableCell, Segment, Button, TextArea, Container } from 'semantic-ui-react';

import LinkRow from '../LinkRow';
import { Input } from 'formsy-semantic-ui-react';

export const ProvenanceTable = (props) => {

    let linkRows = [];

    return (
        <Table selectable>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>URL</Table.HeaderCell>
                    <Table.HeaderCell>Content</Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                <Table.Row>
                    <TableCell >https://react.semantic-ui.com/collections/table/#types-pagination</TableCell>
                    <TableCell collapsing>
                    <Button icon='expand arrows alternate'></Button>
                    </TableCell>
                </Table.Row>
                <Table.Row>
                    <TableCell >https://react.semantic-ui.com/collections/table/#types-pagination</TableCell>
                    <TableCell collapsing>
                    <Button icon='expand arrows alternate'></Button>
                    </TableCell>
                </Table.Row>
                {linkRows}
            </Table.Body>
        </Table>
    );
}

//container part
export const mapStateToProps = (state) => {
    return {
        hash: state.web3.utils.soliditySha3("Testing the length of a defualt hash!Testing the length of a defualt hash!Testing the length of a defualt hash!"),
        hash2: state.web3.utils.sha3("Testing the length of a defualt hash!Testing the length of a defualt hash!Testing the length of a defualt hash!"),
    };
}

export default connect(mapStateToProps)(ProvenanceTable);