import _ from 'lodash'
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Segment, Label, Header } from 'semantic-ui-react';

//import * as actions from './actions';

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

    let labels = tags.map((tag, index) => 
        <Label color={colors[index%colors.length]}>
            {_.capitalize(tag.title)}
        </Label>
    );

    return (
        <Segment>
            <Label.Group circular>
                <Header as="h2" dividing>Link Types:</Header>
                {labels}
            </Label.Group>
        </Segment>
    );
}

//container part
const mapStateToProps = (state) => {
    return {
        tags: state["tagsView"].selectedContract.tags
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(TagsView);