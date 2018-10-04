import React from 'react';
import { Label, Table, Button } from 'semantic-ui-react';

export const LinkRow = ({types, link}) => {
    
    let tags = link.tags.map((tagId) => 
        <Label 
            key={tagId} 
            circular 
            color={types[tagId].getColor()}
        >
            {types[tagId].getTitle()}
        </Label>
    );

    return (
        <Table.Row>
            <Table.Cell>
                <Label as="a" ribbon>{link.address}</Label>
            </Table.Cell>
            <Table.Cell>{link.title}</Table.Cell>
            <Table.Cell>
                {tags}
            </Table.Cell>
            <Table.Cell>
                    <Button icon='info' content="Info" labelPosition='left'/>
                    <Button icon='eye' content="Select" labelPosition='left'/>
            </Table.Cell>
        </Table.Row>
    );
}