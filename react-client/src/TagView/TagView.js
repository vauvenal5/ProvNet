import React from 'react';
import _ from 'lodash';
import { Label } from 'semantic-ui-react';

export const TagView = ({tag}) => {
    const colors = [
        'red',
        'orange',
        'yellow',
        'olive',
        'green',
        'teal',
        'blue',
        'violet',
        'purple',
        'pink',
        'brown',
        'grey',
        'black',
    ];

    const getColor = () => colors[(tag.getId()-1)%colors.length];

    return(
        <Label color={getColor()} key={tag.getId()}>
            {_.capitalize(tag.getTitle())}
        </Label>
    );
}