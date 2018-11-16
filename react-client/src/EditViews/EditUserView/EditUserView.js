import React from 'react';
import EditTagView from '../EditTagView/EditTagView';
import {Form} from "formsy-semantic-ui-react";
import { Dropdown } from 'semantic-ui-react';
import { TagsMap, Tag } from '../../models';
import { ClosableTagButton } from '../../TagView/TagButton';
import * as TagView from '../../TagView';

export class EditUserView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            values: [],
            special: "special",
            link: "link"
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
            
            options.push({
                key: this.mergeKey(keyName, key),
                value: this.mergeKey(keyName, key),
                id: key,
                text: Tag.getTitle(tag),
                icon: { color: TagView.getColor(tag), name: icon }
            })
        });
    }

    filterTags = (key) => this.state.values
        .filter((value) => value.startsWith(key))
        .map((value) => this.idFromMergedKey(value));

    onSubmit = (user) => {
        let specials = this.filterTags(this.state.special);
        let links = this.filterTags(this.state.link);
        this.props.onSubmit(user, links, specials);
    };

    render() {
        let options = [];
        this.appendList(this.props.specials, this.state.special, "star", "Special Roles", options);
        this.appendList(this.props.tags, this.state.link, "tag", "Link Roles", options);


        return (
            <EditTagView {...this.props} onSubmit={this.onSubmit.bind(this)}>
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
                />
            </EditTagView>
        );
    }
}