import React from 'react';
import { connect } from 'react-redux';

import { Table, Label, TableCell, Segment, Button, TextArea, Container } from 'semantic-ui-react';
import { UriSelector, Uri, SelectSelector } from '../models';
import UriMap from '../models/maps/UriMap';
import * as actions from "./actions";

export const ProvenanceTable = ({uris, createPdf}) => {

    let linkRows = UriMap.mapToArray(uris, (key, uri) => {
        let title = Uri.getTitle(uri);
        return(
            <Table.Row>
                <TableCell>{title}</TableCell>
                <TableCell collapsing>
                <Button icon='download' onClick={() => createPdf(key, title)}/>
                </TableCell>
            </Table.Row>
        );
    });

    return (
        <Table selectable>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>URL</Table.HeaderCell>
                    <Table.HeaderCell>Content</Table.HeaderCell>
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
        address: SelectSelector.getSelectedContract(state),
        uris: UriSelector.getContractSelected(state),
        hash: state.web3.utils.soliditySha3("Testing the length of a defualt hash!Testing the length of a defualt hash!Testing the length of a defualt hash!"),
        hash2: state.web3.utils.sha3("Testing the length of a defualt hash!Testing the length of a defualt hash!Testing the length of a defualt hash!"),
    };
}

export const mapDispatchToProps = (dispatch) => {
    return {
        createPdf: (address, id, uri) => dispatch(actions.onCreateProvPdf(address,id, uri))
    }
}

export const mergeProps = (stateProps, dispatchProps, ownProps) => {
    return Object.assign({}, stateProps, dispatchProps, {
        createPdf: (id, uri) => dispatchProps.createPdf(stateProps.address, id, uri)
    }, ownProps);
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ProvenanceTable);