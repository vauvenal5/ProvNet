import React from 'react';
import { connect } from 'react-redux';

import { Table, Label, TableCell, Segment, Button, TextArea, Container } from 'semantic-ui-react';
import { UriSelector, Uri, SelectSelector } from '../models';
import UriMap from '../models/maps/UriMap';
import * as actions from "./actions";
import EditModelSelector from '../models/selectors/EditModelSelector';
import EditModelMap from '../models/maps/EditModelMap';
import {editModelActions} from "../EditViews";
import EditModel from '../models/EditModel';

export const ProvenanceTable = ({uris, onShowProv, editModels = new EditModelMap()}) => {

    let linkRows = UriMap.mapToArray(uris, (key, uri) => {
        let title = Uri.getTitle(uri);
        let model = editModels.get(title);
        let color;
        if(EditModel.isSuccess(model)) {
            color = "green";
        }
        return(
            <Table.Row>
                <TableCell>{title}</TableCell>
                <TableCell collapsing>
                <Button icon='download' color={color} loading={EditModel.isLoading(model)} onClick={() => onShowProv(title, model)}/>
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
        editModels: EditModelSelector.getContractSelected(state)
    };
}

export const mapDispatchToProps = (dispatch) => {
    return {
        onShowProv: (address, uri, editModel) => {
            dispatch(editModelActions.onProvRecordsOpen(true, address, uri));
            if(!EditModel.isSuccess(editModel)) {
                dispatch(editModelActions.onShowProvenance(address, uri));
                dispatch(actions.onProvRecordsShow(address, uri));
            }
        }
    }
}

export const mergeProps = (stateProps, dispatchProps, ownProps) => {
    return Object.assign({}, stateProps, dispatchProps, {
        onShowProv: (uri, model) => dispatchProps.onShowProv(stateProps.address, uri, model)
    }, ownProps);
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ProvenanceTable);