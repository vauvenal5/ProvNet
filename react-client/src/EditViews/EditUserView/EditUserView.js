import React from 'react';
import EditTagView from '../EditTagView/EditTagView';
import {Form} from "formsy-semantic-ui-react";
import { Dropdown } from 'semantic-ui-react';
import { TagsMap, Tag, User } from '../../models';
import { ClosableTagButton } from '../../TagView/TagButton';
import * as TagView from '../../TagView';
import UsersMap from '../../models/maps/UsersMap';
import { addValidationRule } from 'formsy-react';
import BasicModalForm from '../EditModal/BasicModalForm';
import EditModelSelector from '../../models/selectors/EditModelSelector';

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
        let tags = this.props.tags;
        if(label.key.startsWith(this.state.special)) {
            tags = this.props.specials;
        }
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
        if(UsersMap.has(this.props.users, comp.value)) {
            this.props.onReselect(comp.value);
        }
    };

    handleAddItem = (e, comp) => this.setState({added: comp.value});

    render() {
        let options = [];
        this.appendList(this.props.specials, this.state.special, "star", "Special Roles", options);
        this.appendList(this.props.tags, this.state.link, "tag", "Link Roles", options);

        let selected = [];
        User.getSpecialRoles(this.props.user).map(id => selected.push(
            this.mergeKey(this.state.special, id)
        ));
        User.getRoles(this.props.user).map(id => selected.push(
            this.mergeKey(this.state.link, id)
        ));

        let userOptions = UsersMap.mapToArray(this.props.users, key => ({
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
        if(User.getAddress(this.props.user).localeCompare(EditModelSelector.userKey)) {
            selectedUser = User.getAddress(this.props.user);
        }

        return (
            <BasicModalForm {...this.props} onSubmit={
                () => this.onSubmit(selectedUser)
            }>
                <Form.Dropdown
                    label="User"
                    name="user"
                    required
                    placeholder="User Address"
                    search
                    selection
                    allowAdditions
                    options={userOptions}
                    onChange={this.handleNewChange.bind(this)}
                    onAddItem={this.handleAddItem.bind(this)}
                    value={selectedUser}
                />
                <Form.Dropdown 
                    label="User Roles" 
                    name="dropdown" 
                    required 
                    placeholder="User Roles" 
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