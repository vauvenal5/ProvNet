import React from 'react';
import { connect } from 'react-redux';

import { Segment, Header, List, Icon } from 'semantic-ui-react';
import { TagButton } from '../TagView/TagButton';
import {TagsMap, TagSelector, SelectSelector} from '../models';
import EditModelSelector from '../models/selectors/EditModelSelector';
import EditModelMap from '../models/maps/EditModelMap';
import EditModel from '../models/EditModel';
import * as editModelActions from "../EditViews/actions";
import {selectActions} from "../SelectReducer";

export const TagsListView = ({tags, list = new TagsMap(), onEditTag, tagModals}) => {

    let labels = [];
    tags = list.getItems();
    console.log(tags);

    //todo-sv: the list items should be filled in the parent element and this one should only encapsulate them
    //compound components: https://medium.com/@Dane_s/react-js-compound-components-a6e54b5c9992 
    for(let key in tags) {
        let tag = tags[key];
        
        let modal=undefined;
        if(tagModals) {
            //modal = EditModalTagList.getModal(tagModals, key);
            modal = EditModelMap.get(tagModals, key);
        }
        
        let isLoading = false;
        if(modal) {
            isLoading = EditModel.isLoading(modal);
        }

        let icon = (<Icon name='edit' fitted/>);
        
        if(modal && EditModel.isSuccess(modal)) {
            icon = (<Icon name='check' color="green" fitted/>);
        }

        if(modal && EditModel.isError(modal)) {
            icon = (<Icon name='close' color="red" fitted/>);
        }

        labels.push(
            <List.Item key={tag.getId()}>
                <TagButton tag={tag} icon={icon} parentClick={() => onEditTag(tag.getId())} loading={isLoading} />
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
    let selectedAddress = SelectSelector.getSelectedContract(state);
    return {
        selectedContract: selectedAddress,
        tagModals: EditModelSelector.getContractSelected(state),
        list: TagSelector.getContractSelected(state)
    }
}

export const mapDispatchToProps = (dispatch) => {
    return {
        onEditTag: (selected, tagId) => dispatch(editModelActions.onEditTagModalOpen(true, selected, tagId))
    }
}

export const mergeProps = (stateProps, dispatchProps, ownProps) => {
    return Object.assign({}, ownProps, stateProps, dispatchProps, {
        onEditTag: (tagId) => dispatchProps.onEditTag(stateProps.selectedContract, tagId)
    });
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(TagsListView);