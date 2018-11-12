import React from 'react';
import { connect } from 'react-redux';
import { Item, Button, Image, Icon, Label, Dimmer, Loader, Segment } from 'semantic-ui-react';
import {withDefaultImage} from "../withDefaultImage";
import { ContractDetails, ProvContract, ProvContractSelector } from '../models';

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
    let selected = ProvContractSelector.getSelected(state);
    return {
        imageUrl: ContractDetails.getLogoUrl(ProvContract.getDetails(selected)),
        description: ContractDetails.getDescription(ProvContract.getDetails(selected))
    };
}

export default connect(mapStateToProps)(withDefaultImage(ContractDetailsView));