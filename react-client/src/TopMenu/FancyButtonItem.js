import React from 'react';
import { Menu, Icon, Dimmer, Loader } from 'semantic-ui-react';

export const FancyButtonItem = ({onClick, loading, success, error, icon, childIcon, disabled}) => {
    return (
        <Menu.Item onClick={() => onClick()} disabled={disabled}>
            <Dimmer active={loading}>
                <Loader />
            </Dimmer>
            <Dimmer active={success}>
                <Icon name="check" color="green" size="big" />
            </Dimmer>
            <Dimmer active={error}>
                <Icon name="close" color="red" size="big" />
            </Dimmer>
            <Icon.Group size="big">
                <Icon name={icon}/>
                <Icon name={childIcon} color="blue" corner disabled={disabled}/>
            </Icon.Group>
        </Menu.Item>
    );
};