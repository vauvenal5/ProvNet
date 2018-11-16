import React from 'react';
import {TagView, getColor} from './TagView';
import { Table, Label, TableCell, Segment, Button, Icon, Container } from 'semantic-ui-react';

export const TagButton = ({tag, icon, parentClick = ()=>{}, childClick = ()=>{}, loading, ...tagViewProps}) => {
    
    return(
        <Button as='div' labelPosition='left' compact size="tiny" onClick={() => parentClick(tag.getId())} >
            <TagView tag={tag} basic size="tiny" {...tagViewProps}/>
            <Button color={getColor(tag)} loading={loading} compact size="tiny" icon onClick={(e) => childClick(tag.getId(), e)}>
                {icon}
            </Button>
        </Button>
    );
}

export const ClosableTagButton = (props) => {
    let icon = (<Icon name='close' fitted/>);
    return (
        <TagButton icon={icon} {...props} />
    );
}