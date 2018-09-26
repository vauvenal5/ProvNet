import _ from 'lodash'
import React from 'react';
import PropTypes from 'prop-types';

import { Segment, Label, Header } from 'semantic-ui-react';

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

export const TagsView = ({tags}) => {
    
    // let labels = tags.map((tag, index) => 
    //     <Label color={colors[index%colors.length]}>
    //         {_.capitalize(tag.title)}
    //     </Label>
    // );

    let labels = [];

    for(let key in tags) {
        let tag = tags[key];
        labels.push(
            <Label color={colors[(key-1)%colors.length]}>
                {_.capitalize(tag.title)}
            </Label>
        );
    }

    return (
        <Segment>
            <Label.Group circular>
                <Header as="h2" dividing>Link Types:</Header>
                {labels}
            </Label.Group>
        </Segment>
    );
}

TagsView.propTypes = {
    tags: PropTypes.array.isRequired
}

export default TagsView;