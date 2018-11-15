import React from 'react';
import { Menu, Icon, Dimmer, Loader } from 'semantic-ui-react';
import EditModel from '../models/EditModel';

export const FancyButtonItem = ({onClick, editModel = new EditModel(), icon, childIcon, disabled}) => {
    return (
        <Menu.Item onClick={() => onClick()} disabled={disabled}>
            <Dimmer active={editModel.isLoading()}>
                <Loader />
            </Dimmer>
            <Dimmer active={editModel.isSuccess()}>
                <Icon name="check" color="green" size="big" />
            </Dimmer>
            <Dimmer active={editModel.isError()}>
                <Icon name="close" color="red" size="big" />
            </Dimmer>
            <Icon.Group size="big">
                <Icon name={icon}/>
                <Icon name={childIcon} color="blue" corner disabled={disabled}/>
            </Icon.Group>
        </Menu.Item>
    );
};