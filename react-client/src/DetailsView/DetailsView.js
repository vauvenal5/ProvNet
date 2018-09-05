import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Grid, Header } from 'semantic-ui-react';

import TagsView from '../TagsView';
import ContractForm from "../ContractForm";

//import * as actions from './actions';

export const DetailsView = ({selected, contract}) => {
    console.log("RENDERING DETAILS");
    
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
                    <ContractForm.Component imageUrl={contract.logoUrl} description={contract.description}/>
                </Grid.Column>
                <Grid.Column floated="right" width={5}>
                    <TagsView.Component tags={contract.types}/>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
}

const selectedContract = (contracts, selected) => {
    if(selected === undefined) {
        return {types: []};
    }
    return contracts[selected];
}

//container part
const mapStateToProps = (state) => {
    console.log("DetailsView");
    console.log(state);
    return {
        selected: state["detailsView"].selected,
        contract: selectedContract(state.contracts, state["detailsView"].selected),
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailsView);