import React from 'react';
import { Label, Table, Button } from 'semantic-ui-react';
import TagView from '../TagView';

export const LinkRow = ({types, link}) => {
    
    let tags = link.tags.map(
        (tagId) => <TagView key={tagId} tag={types[tagId]}/>
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