import React from 'react';
import _ from 'lodash';
import { Label, Icon } from 'semantic-ui-react';

const colors = [
    'green',
    'orange',
    'yellow',
    'olive',
    'teal',
    'blue',
    'violet',
    'purple',
    'pink',
    'brown',
    'grey',
    'black',
];

export const getColor = (tag) => colors[(tag.getId()-1)%colors.length];

export const getTitle = (tag) => _.capitalize(tag.getTitle());

export const TagView = ({tag, ...labelProps}) => {
    const getColor = () => colors[(tag.getId()-1)%colors.length];

    return(
        <Label color={getColor(tag)} {...labelProps}>
            <Icon name="tag"/>
            {getTitle(tag)}
        </Label>
    );
}