import React from 'react';
import { connect } from 'react-redux';

import { Grid, Header, Label, Icon, Dimmer, Loader, Segment, Button } from 'semantic-ui-react';

import TagsView from '../TagsView';
import ContractDetailsView from "./ContractDetailsView";
import ProvContract from '../models/ProvContract';
import TagsTableView from "../TagsTableView/TagsTableView";
import TagsListView from "../TagsListView/TagsListView";
import { ContentView } from './ContentView';
import { default as ContractHeader } from './ContractHeader';
import { ProvContractList } from '../models';
import { RootSelector } from '../models';
import Select from '../models/Select';

export const ContractView = ({contract}) => {    
    return (
        <Grid padded>
            <Grid.Row>
                <Grid.Column>
                    <ContractHeader/>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={2}>
                <Grid.Column stretched>
                    <ContractDetailsView/>
                </Grid.Column>
                <Grid.Column floated="right" width={5}>
                    <TagsListView tags={contract.getTags()}/>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column>
                    <ContentView/>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
}

//container part
export const mapStateToProps = (state) => {
    let contract = ProvContractList.getContract(
        RootSelector.getContracts(state),
        Select.getSelectedContract(RootSelector.getSelect(state))
    );

    return {
        contract: contract
    };
}

export default connect(mapStateToProps)(ContractView);