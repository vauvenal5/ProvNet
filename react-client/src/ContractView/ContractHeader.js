import React from 'react';
import { connect } from 'react-redux';

import { Grid, Header, Label, Icon, Dimmer, Loader, Segment, Button } from 'semantic-ui-react';

import ProvContract from '../models/ProvContract';
import { ProvContractList, ContractDetails } from '../models';
import Select from '../models/Select';
import { RootSelector } from '../models';

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
    let address = Select.getSelectedContract(RootSelector.getSelect(state));
    let selected = ProvContractList.getContract(RootSelector.getContracts(state), address);

    return {
        address: address,
        title: ContractDetails.getTitle(ProvContract.getDetails(selected))
    };
}

export default connect(mapStateToProps)(ContractHeader);