import React from 'react';
import { connect } from 'react-redux';

import { Grid, Header, Label, Icon, Dimmer, Loader, Segment, Button } from 'semantic-ui-react';

import ProvContract from '../models/ProvContract';
import { ContractDetails } from '../models';
import ProvContractSelector from '../models/selectors/ProvContractSelector';

export const ContractHeader = ({address, title}) => {    
    return (
        <Header as="h1" dividing>
            ProvContract: {title}
            <Header.Subheader>
                Contract Address: {address}
            </Header.Subheader>
        </Header>
    );
}

//container part
export const mapStateToProps = (state) => {
    let selected = ProvContractSelector.getSelected(state);

    return {
        address: ProvContract.getAddress(selected),
        title: ContractDetails.getTitle(ProvContract.getDetails(selected))
    };
}

export default connect(mapStateToProps)(ContractHeader);