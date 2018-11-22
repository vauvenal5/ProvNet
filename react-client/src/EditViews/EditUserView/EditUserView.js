import React from 'react';
import EditTagView from '../EditTagView/EditTagView';
import {Form} from "formsy-semantic-ui-react";
import { Dropdown } from 'semantic-ui-react';
import { TagsMap, Tag, User, MapModel, ContractTagsMap } from '../../models';
import { ClosableTagButton } from '../../TagView/TagButton';
import * as TagView from '../../TagView';
import UsersMap from '../../models/maps/UsersMap';
import { addValidationRule } from 'formsy-react';
import BasicModalForm from '../EditModal/BasicModalForm';
import EditModelSelector from '../../models/selectors/EditModelSelector';
import TagArrayMap from '../../models/maps/TagArrayMap';
import TagArray from '../../models/TagArray';
import TagOptionsMap from '../../models/maps/TagOptionsMap';

addValidationRule("doesNotExist", (values, value, array) => {
    return array.indexOf(values["title"]) < 0;
})

export class EditUserView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            values: [],
            special: "special",
            link: "link",
            added: undefined,
        }
    }

    handleChange = (e, comp) => this.setState({values: comp.value});

    renderLabel = (label, index, defaultProps) => {
        let tags = ContractTagsMap.get(this.props.options, label.map);
        return (
            <ClosableTagButton 
                tag={TagsMap.get(tags, label.id)} 
                tagIcon={label.icon.name}
                childClick={(id, e) => defaultProps.onRemove(e, defaultProps)} 
            />
        )
    };

    mergeKey(keyName, key) {
        return keyName + "-" + key;
    }

    idFromMergedKey(mergedKey) {
        return mergedKey.split("-")[1];
    }

    appendList = (tags, keyName, icon, title, options) => {
        options.push(<Dropdown.Header key={keyName} icon={icon} content={title}/>)
        TagsMap.forEach(tags, (key, tag) => {
            options.push(this.convertTag(key, keyName, icon, tag));
        });
    }

    convertTag = (key, keyName, icon, tag) => {
        return ({
            key: this.mergeKey(keyName, key),
            value: this.mergeKey(keyName, key),
            map: keyName,
            id: key,
            text: Tag.getTitle(tag),
            icon: { color: TagView.getColor(tag), name: icon }
        });
    }

    filterTags = (key) => this.state.values
        .filter((value) => value.startsWith(key))
        .map((value) => this.idFromMergedKey(value));

    onSubmit = (userId) => {
        let specials = this.filterTags(this.state.special);
        let links = this.filterTags(this.state.link);
        this.props.onSubmit(userId, links, specials);
    };

    handleNewChange = (e, comp) => {
        if(MapModel.has(this.props.taggedMap, comp.value)) {
            this.props.onReselect(comp.value);
        }
    };

    handleAddItem = (e, comp) => this.setState({added: comp.value});

    render() {
        let options = [];
        ContractTagsMap.forEach(this.props.options, (key, tags) => {
            this.appendList(tags, key, TagOptionsMap.getIcon(tags), TagOptionsMap.getTitle(tags), options);
        });

        let selected = [];
        TagArrayMap.forEach(this.props.tagged, (key, tagArray) => {
            TagArray.getTags(tagArray).map(id => {
                selected.push(
                this.mergeKey(key, id)
            )});
        });

        let userOptions = MapModel.mapToArray(this.props.taggedMap, key => ({
            key: key,
            value: key,
            text: key
        }));

        if(this.state.added) {
            userOptions.push({
                key: this.state.added,
                value: this.state.added,
                text: this.state.added
            });
        }

        let selectedUser = this.state.added;
        if(TagArrayMap.getId(this.props.tagged).localeCompare(EditModelSelector.userKey)) {
            selectedUser = TagArrayMap.getId(this.props.tagged);
        }

        return (
            <BasicModalForm {...this.props} onSubmit={
                () => this.onSubmit(selectedUser)
            }>
                <Form.Dropdown
                    label={this.props.labelTitle}
                    name="address"
                    required
                    placeholder={this.props.labelTitle}
                    search
                    selection
                    allowAdditions
                    options={userOptions}
                    onChange={this.handleNewChange.bind(this)}
                    onAddItem={this.handleAddItem.bind(this)}
                    value={selectedUser}
                />
                <Form.Dropdown 
                    label={this.props.labelTags} 
                    name="dropdown" 
                    required 
                    placeholder={this.props.labelTags} 
                    multiple 
                    search 
                    selection 
                    options={options} 
                    renderLabel={this.renderLabel.bind(this)}
                    onChange={this.handleChange.bind(this)}
                    value={selected}
                    validations="minLength:1"
                />
            </BasicModalForm>
        );
    }
}