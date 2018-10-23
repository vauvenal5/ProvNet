import React from 'react';

import { Segment, Label, Header, Dimmer, Loader, List, Icon, Button } from 'semantic-ui-react';
import TagView from '../TagView';

export const TagsListView = ({tags}) => {

    let labels = [];

    for(let key in tags) {
        let tag = tags[key];
        labels.push(
            <TagView key={tag.getId()} tag={tag}/>
        );
    }

    return (
        <Segment>
            <Header as="h2" dividing>Link Types:</Header>
            <List horizontal size="tiny">
                {/* Necessary to align list properly. See https://github.com/Semantic-Org/Semantic-UI/issues/4501 */}
                <List.Item></List.Item>
                <List.Item>
                    <Button as='div' labelPosition='right' compact size="tiny">
                        <Button disabled icon color="green" compact size="tiny">
                            <Icon name='edit'/>
                        </Button>
                        <Label as="a" color="green" size="tiny">
                            Trusted
                            <Label.Detail>1</Label.Detail>
                        </Label>
                        
                    </Button>
                </List.Item>
                <List.Item>
                    <Button as='div' labelPosition='right' compact size="tiny">
                        <Button icon color="yellow" loading compact size="tiny">
                            <Icon name='edit' />
                        </Button>
                        <Label color="yellow" size="tiny">
                            Known
                            <Label.Detail>23</Label.Detail>
                        </Label>
                    </Button>
                </List.Item>
                <List.Item>
                    <Button as='div' labelPosition='right' compact size="tiny">
                        <Button icon color="yellow"  compact size="tiny">
                            <Icon name='edit' size="small" />
                        </Button>
                        <Label color="yellow" size="tiny">
                            Known
                            <Label.Detail>23</Label.Detail>
                        </Label>
                    </Button>
                </List.Item>
                <List.Item>
                    <Button as='div' labelPosition='right' compact size="tiny">
                        <Button icon color="yellow" basic compact size="tiny">
                            <Icon name='edit' />
                        </Button>
                        <Label color="yellow" size="tiny">
                            Known
                            <Label.Detail>23</Label.Detail>
                        </Label>
                    </Button>
                </List.Item>
                <List.Item>
                    <Button as='div' labelPosition='right' compact size="tiny">
                        <Button icon color="yellow" basic compact size="tiny">
                            <Icon name='edit' />
                        </Button>
                        <Label color="yellow" size="tiny">
                            Known
                            <Label.Detail>23</Label.Detail>
                        </Label>
                    </Button>
                </List.Item>
                <List.Item>
                    <Button size="tiny">
                        <Icon name="edit" size="tiny"/>
                    </Button>
                </List.Item>
            </List>
        </Segment>
    );
}

export default TagsListView;