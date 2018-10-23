import React from 'react';
import { Item, Button, Image, Icon, Label, Dimmer, Loader, Segment } from 'semantic-ui-react';

//component part
export const ContractForm = (props) => {
    let url = props.imageUrl;
    if(url === undefined || url === "") {
        url = 'https://react.semantic-ui.com/images/wireframe/square-image.png';
    }

    return (
           
        <Item.Group>
            <Item>
                <Item.Image src={url} size='small' circular/>

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

export default ContractForm;