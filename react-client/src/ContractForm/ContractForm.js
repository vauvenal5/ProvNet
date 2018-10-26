import React from 'react';
import { Item, Button, Image, Icon, Label, Dimmer, Loader, Segment } from 'semantic-ui-react';
import {withDefaultImage} from "../withDefaultImage";

//component part
export const ContractForm = (props) => {
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

export default withDefaultImage(ContractForm);