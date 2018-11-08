import React from 'react';
import { connect } from 'react-redux';

import { Segment, Label, Header, Dimmer, Loader, List, Icon, Button } from 'semantic-ui-react';
import TagView,{getColor} from '../TagView';
import * as modelActions from "../modelActions";
import {editTagActions, EditModalLeaf} from "../EditViews";
import ProvContract from '../models/ProvContract';
import ProvContractList from '../models/ProvContractList';
import EditModalTagList from '../EditViews/EditTagView/EditModalTagList';
import Select from '../models/Select';
import { RootSelector } from '../models';
import { TagButton } from '../TagView/TagButton';
import ListModel from '../models/ListModel';

export const TagsListView = ({tags, onEditTag, tagModals}) => {

    let labels = [];
    console.log(tagModals);

    //todo-sv: the list items should be filled in the parent element and this one should only encapsulate them
    //compound components: https://medium.com/@Dane_s/react-js-compound-components-a6e54b5c9992 
    for(let key in tags) {
        let tag = tags[key];
        
        let modal=undefined;
        if(tagModals) {
            modal = EditModalTagList.getModal(tagModals, key);
        }
        
        let isLoading = false;
        if(modal) {
            isLoading = EditModalLeaf.isLoading(modal);
        }

        let icon = (<Icon name='edit' fitted/>);
        
        if(modal && EditModalLeaf.isSuccess(modal)) {
            icon = (<Icon name='check' color="green" fitted/>);
        }

        if(modal && EditModalLeaf.isError(modal)) {
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
    let selectedAddress = Select.getSelectedContract(RootSelector.getSelect(state));
    return {
        selectedContract: selectedAddress,
        tagModals: EditModalTagList.getModal(state.editTag, selectedAddress),
        tags: ListModel.getItems(ListModel.get(RootSelector.getTags(state), selectedAddress))
    }
}

export const mapDispatchToProps = (dispatch) => {
    return {
        onEditTag: (selected, tagId) => dispatch(editTagActions.onEditTagModalOpen(true, selected, tagId)),
    }
}

export const mergeProps = (stateProps, dispatchProps, ownProps) => {
    return Object.assign({}, ownProps, stateProps, dispatchProps, {
        onEditTag: (tagId) => dispatchProps.onEditTag(stateProps.selectedContract, tagId)
    });
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(TagsListView);