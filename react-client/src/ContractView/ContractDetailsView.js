import React from 'react';
import { connect } from 'react-redux';
import { Item, Button, Image, Icon, Label, Dimmer, Loader, Segment } from 'semantic-ui-react';
import {withDefaultImage} from "../withDefaultImage";
import { ProvContractList, ContractDetails, ProvContract } from '../models';
import Select from '../models/Select';
import { RootSelector } from '../models';

//component part
export const ContractDetailsView = (props) => {
    return (
           
        <Item.Group>
            <Item>
                <Item.Image src={props.imageUrl} size='small' circular/>

                <Item.Content>
                    <Item.Header>
                        Description                        
                    </Item.Header>
                    <Item.Description>
                        {props.description}
                    </Item.Description>
                </Item.Content>
            </Item>
        </Item.Group>
    );
}

export const mapStateToProps = (state) => {
    let selected = ProvContractList.getContract(
        RootSelector.getContracts(state), 
        Select.getSelectedContract(RootSelector.getSelect(state))
    );
    return {
        imageUrl: ContractDetails.getLogoUrl(ProvContract.getDetails(selected)),
        description: ContractDetails.getDescription(ProvContract.getDetails(selected))
    };
}

export default connect(mapStateToProps)(withDefaultImage(ContractDetailsView));