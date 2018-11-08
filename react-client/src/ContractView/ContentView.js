import React, {Fragment} from 'react';
import { connect } from 'react-redux';

import { Menu, Segment } from 'semantic-ui-react';
import LinksView from '../LinksView';
import {ProvenanceView} from "../ProvenanceView";
import {UsersView} from "../UsersView";

export class ContentView extends React.Component {
    state = { 
        items: {
            links: "links",
            provenance: "provenance",
            users: "users"
        },
        activeItem: 'links' }

    handleItemClick = (e, { name }) => this.setState({ activeItem: name })

    render() {

        let activeComponent;

        switch(this.state.activeItem) {
            case this.state.items.links:
                activeComponent = (<LinksView.Component />);
                break;
            case this.state.items.provenance:
                activeComponent = (<ProvenanceView/>);
                break;
            case this.state.items.users:
                activeComponent = (<UsersView/>);
                break;
            default:
                break;
        }

        return (
            <Fragment>
                <Menu attached='top' tabular>
                    {
                        Object.keys(this.state.items).map(
                            name => <Menu.Item name={name} active={this.state.activeItem === name} onClick={this.handleItemClick}/>
                        )
                    }
                </Menu>
                <Segment attached='bottom'>
                    {activeComponent}
                </Segment>
            </Fragment>
        );
    }
}