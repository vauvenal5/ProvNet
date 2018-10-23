import React from 'react';
import { connect } from 'react-redux';

import { Grid, Header, Label, Icon, Dimmer, Loader, Segment, Button } from 'semantic-ui-react';

import TagsView from '../TagsView';
import ContractForm from "../ContractForm";
import ProvContract from '../models/ProvContract';
import TagsTableView from "../TagsTableView/TagsTableView";
import TagsListView from "../TagsListView/TagsListView";

export const DetailsView = ({selected, contract}) => {    
    return (
        <Grid padded>
            <Grid.Row>
                <Grid.Column>
                    <Header as="h1" dividing>
                        ProvContract
                        <Header.Subheader>
                            Contract Address: {selected}
                        </Header.Subheader>
                    </Header>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={2}>
                <Grid.Column stretched>
                    <ContractForm.Component imageUrl={contract.details.logoUrl} description={contract.details.description}/>
                </Grid.Column>
                <Grid.Column floated="right" width={5}>
                    <TagsListView/>
                    {/* <TagsView.Component 
                        tags={contract.getTags()}
                    /> */}
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
}

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
        contract: selectedContract(state.contracts, selected),
    };
}

export default connect(mapStateToProps)(DetailsView);