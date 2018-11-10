import React from 'react';

import { Grid} from 'semantic-ui-react';

import ContractDetailsView from "./ContractDetailsView";
import TagsListView from "../TagsListView/TagsListView";
import { ContentView } from './ContentView';
import { default as ContractHeader } from './ContractHeader';

export const ContractView = () => {    
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
                    <TagsListView />
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

export default ContractView;