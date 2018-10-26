import React from 'react';
import { connect } from 'react-redux';

import { Segment, Label, Header, Dimmer, Loader, List, Icon, Button } from 'semantic-ui-react';
import TagView,{getColor} from '../TagView';
import * as modelActions from "../modelActions";
import ProvContract from '../models/ProvContract';
import ProvContractList from '../models/ProvContractList';

export const TagsListView = ({tags, onEditTag}) => {

    let labels = [];

    //todo-sv: the list items should be filled in the parent element and this one should only encapsulate them
    //compound components: https://medium.com/@Dane_s/react-js-compound-components-a6e54b5c9992 
    for(let key in tags) {
        let tag = tags[key];
        labels.push(
            <List.Item key={tag.getId()}>
                <Button as='div' labelPosition='right' compact size="tiny" onClick={() => onEditTag(tag.getId())}>
                    <Button color={getColor(tag)} loading={false} compact size="tiny">
                        <Icon name='edit' fitted/>
                    </Button>
                    <TagView tag={tag} basic size="tiny" pointing="left"/>                    
                </Button>
            </List.Item>
        );
    }

    return (
        <Segment>
            <Header as="h2" dividing>Link Types:</Header>
            <List horizontal size="tiny">
                {/* Necessary to align list properly. See https://github.com/Semantic-Org/Semantic-UI/issues/4501 */}
                <List.Item></List.Item>
                {labels}
            </List>
        </Segment>
    );
}

export const mapStateToProps = (state) => {
    let selected = ProvContractList.getSelectedContract(ProvContractList.getSelf(state));
    return {
        selectedContract: ProvContract.getAddress(selected)
    }
}

export const mapDispatchToProps = (dispatch) => {
    return {
        onEditTag: (selected, tagId) => dispatch(modelActions.onEditTagModalOpen(true, selected, tagId)),
    }
}

export const mergeProps = (stateProps, dispatchProps, ownProps) => {
    return Object.assign({}, ownProps, stateProps, dispatchProps, {
        onEditTag: (tagId) => dispatchProps.onEditTag(stateProps.selectedContract, tagId)
    });
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(TagsListView);