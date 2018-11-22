import React from 'react';
import { Menu, Icon, Dimmer, Loader } from 'semantic-ui-react';
import EditModel from '../models/EditModel';
import { ErrorIcon } from '../DefaultIcons/ErrorIcon';
import { SuccessIcon } from '../DefaultIcons/SuccessIcon';

export const FancyButtonItem = ({onClick, editModel = new EditModel(), icon, childIcon, disabled}) => {
    return (
        <Menu.Item onClick={() => onClick()} disabled={disabled}>
            <Dimmer active={editModel.isLoading()}>
                <Loader />
            </Dimmer>
            <Dimmer active={editModel.isSuccess()}>
                <SuccessIcon size="big"/>
            </Dimmer>
            <Dimmer active={editModel.isError()}>
                <ErrorIcon size="big"/>
                {/* <Icon name="warning" color="red" size="big" /> */}
            </Dimmer>
            <Icon.Group size="big">
                <Icon name={icon}/>
                <Icon name={childIcon} color="blue" corner disabled={disabled}/>
            </Icon.Group>
        </Menu.Item>
    );
};