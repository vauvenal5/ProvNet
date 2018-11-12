import React from 'react';
import { connect } from 'react-redux';
import { Label, Table, Button } from 'semantic-ui-react';
import TagView from '../../../TagView';
import * as actions from '../../../modelActions';

export const LinkRow = ({types, link, linkSelect, contractSelect}) => {
    
    let tags = link.tags.map(
        (tagId) => <TagView key={tagId} tag={types[tagId]}/>
    );

    return (
        <Table.Row>
            <Table.Cell>
                {/* <Label as="a" ribbon 
                    onClick={(e, data) => linkSelect(link.getAddress())}
                > */}
                    {link.address}
                {/* </Label> */}
            </Table.Cell>
            <Table.Cell>{link.title}</Table.Cell>
            <Table.Cell>
                {tags}
            </Table.Cell>
            <Table.Cell>
                    {/* <Button icon='info' content="Info" labelPosition='left'/> */}
                    <Button onClick={() => linkSelect(link.getAddress())} icon='eye' content="Links" labelPosition='left'/>
                    <Button onClick={() => contractSelect(link.getAddress())} icon='file alternate outline' content="Select" labelPosition='left'/>
            </Table.Cell>
        </Table.Row>
    );
}

export const mapDispatchToProps = (dispatch) => {
    return {
        linkSelect: (address) => dispatch(actions.onLinkSelect(address)),
        contractSelect: (address) => dispatch(actions.onContractSelect(address))
    }
}

export default connect(undefined, mapDispatchToProps)(LinkRow);