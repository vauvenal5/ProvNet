import React from 'react';

import { Segment, Label, Header } from 'semantic-ui-react';

export const TagsView = ({tags}) => {

    let labels = [];

    for(let key in tags) {
        let tag = tags[key];
        labels.push(
            <Label color={tag.getColor()} key={tag.id}>
                {tag.getTitle()}
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

export default TagsView;