import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Grid, Header } from 'semantic-ui-react';

import TagsView from '../TagsView';
import ContractForm from "../ContractForm";

//import * as actions from './actions';

export const DetailsView = (props) => {
    return (
        <Grid padded>
            <Grid.Row>
                <Grid.Column>
                    <Header as="h1" dividing>
                        ProvContract
                        <Header.Subheader>
                            Contract Address: 0x232489739826493264
                        </Header.Subheader>
                    </Header>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={2}>
                <Grid.Column stretched>
                    <ContractForm.Component/>
                </Grid.Column>
                <Grid.Column floated="right" width={5}>
                    <TagsView.Component/>
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailsView);