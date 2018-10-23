import React from 'react';

import { Segment, Label, Header, Dimmer, Loader, Icon } from 'semantic-ui-react';
import TagView from '../TagView';

export const TagsView = ({tags}) => {

    let labels = [];

    for(let key in tags) {
        let tag = tags[key];
        labels.push(
            <TagView key={tag.getId()} tag={tag}/>
        );
    }

    return (
        <Segment>
            
            <Header as="h2" dividing>
            Link Types: 
            
            </Header>
            
            <Label attached="top right" as="a">
            <Icon name="add square" fitted/>
            </Label>

            <Label.Group>
            
            <Label as="a" color="red">
            Test
            </Label>
            <Label as="a" basic color="red">
            Test
            </Label>
                {/* {labels} */}
            </Label.Group>
        </Segment>
    );
}

export default TagsView;