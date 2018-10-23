import React from 'react';

import { Segment, Label, Header, Dimmer, Loader, Table, Icon, Button } from 'semantic-ui-react';
import TagView from '../TagView';

export const TagsTableView = ({tags}) => {

    let labels = [];

    for(let key in tags) {
        let tag = tags[key];
        labels.push(
            <TagView key={tag.getId()} tag={tag}/>
        );
    }

    return (
        <Segment>
            <Table compact selectable >
                <Table.Header>
                <Table.Row>
                    <Table.HeaderCell colSpan="3">Tag</Table.HeaderCell>
                </Table.Row>
                </Table.Header>

                <Table.Body>
                    <Table.Row color="red">
                        <Table.Cell  >                            
                            {/* <Dimmer.Dimmable> */}
                            <Button as='div' labelPosition='right' compact size="tiny">
                                <Button icon color="green" basic compact size="tiny">
                                    <Icon name='warning' color="red"/>
                                    
                                </Button>
                                <Label color="green" size="tiny">
                                    Trusted
                                    <Label.Detail>1</Label.Detail>
                                </Label>
                                
                            </Button>
                            {/* </Dimmer.Dimmable> */}
                            <Button as='div' labelPosition='right' compact size="tiny">
                                <Button icon color="yellow" basic compact size="tiny">
                                    <Icon name='edit' />
                                </Button>
                                <Label color="yellow" size="tiny">
                                    Known
                                    <Label.Detail>23</Label.Detail>
                                </Label>
                            </Button>
                            <Button as='div' labelPosition='right' compact size="tiny">
                                <Button icon color="yellow" basic compact size="tiny">
                                    <Icon name='edit' />
                                </Button>
                                <Label color="yellow" size="tiny">
                                    Known
                                    <Label.Detail>23</Label.Detail>
                                </Label>
                            </Button>
                            <Button as='div' labelPosition='right' compact size="tiny">
                                <Button icon color="yellow" basic compact size="tiny">
                                    <Icon name='edit' />
                                </Button>
                                <Label color="yellow" size="tiny">
                                    Known
                                    <Label.Detail>23</Label.Detail>
                                </Label>
                            </Button>
                            <Button as='div' labelPosition='right' compact size="tiny">
                                <Button icon color="yellow" basic compact size="tiny">
                                    <Icon name='edit' />
                                </Button>
                                <Label color="yellow" size="tiny">
                                    Known
                                    <Label.Detail>23</Label.Detail>
                                </Label>
                            </Button>
                            
                        </Table.Cell>
                        <Table.Cell>
                            <Button floated='right' icon='edit' size="mini"/>
                            <Button floated='right' icon='trash' size="mini"/>
                        </Table.Cell>
                        <Table.Cell selectable textAlign="center">
                            <Icon name="edit"/>
                        </Table.Cell>
                    </Table.Row>
                </Table.Body>

                <Table.Footer>
                <Table.Row>
                    <Table.HeaderCell colSpan="2">
                    <Button floated='left' icon labelPosition='left' primary size='small'>
                        <Icon name='tag' /> Add Tag
                    </Button>
                    </Table.HeaderCell>
                </Table.Row>
                </Table.Footer>
            </Table>
        </Segment>
    );
}

export default TagsTableView;