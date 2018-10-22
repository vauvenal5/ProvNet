import React from 'react';
import { Item, Button, Icon, Label, Dimmer, Loader, Segment } from 'semantic-ui-react';

//component part
export const ContractForm = (props) => {
    let url = props.imageUrl;
    if(url === undefined || url === "") {
        url = 'https://react.semantic-ui.com/images/wireframe/square-image.png';
    }

    return (
        <Segment>
            
        <Item.Group>
            <Item>
                <Item.Image src={url} size='small' circular/>

                <Item.Content>
                
                    <Item.Header>
                        Description
                        <Label as='a' >
                <Icon name="edit" fitted/>
                <Dimmer active={true}>
                    <Loader size="tiny"/>
                </Dimmer>
            </Label>
                    </Item.Header>
                    <Item.Description>
                        {props.description}
                    </Item.Description>
                </Item.Content>
            </Item>
        </Item.Group>
        </Segment>
    );
}

export default ContractForm;