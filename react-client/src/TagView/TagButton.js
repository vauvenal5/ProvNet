import React from 'react';
import {TagView, getColor} from './TagView';
import { Table, Label, TableCell, Segment, Button, Icon, Container } from 'semantic-ui-react';

export const TagButton = ({tag, icon, parentClick = ()=>{}, childClick = ()=>{}, pointing, loading}) => {
    
    return(
        <Button as='div' labelPosition='left' compact size="tiny" onClick={() => parentClick(tag.getId())} >
            <TagView tag={tag} basic size="tiny" pointing={pointing}/>
            <Button color={getColor(tag)} loading={loading} compact size="tiny" icon onClick={() => childClick(tag.getId())}>
                {icon}
            </Button>
        </Button>
    );
}