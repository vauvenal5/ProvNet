import React from 'react';
import { connect } from 'react-redux';
import { Breadcrumb, Label } from 'semantic-ui-react';
import * as actions from '../modelActions';

export const LinkNav = ({selection, contracts, linkSelect}) => {
    
    let sections = selection.map((selected, index) => {
        let divider = "";
        if(index < (selection.length-1)) {
            divider = (<Breadcrumb.Divider icon='right chevron' />);
        }

        return (
            <div>
            <Breadcrumb.Section key={selected}>
                <Label as='a' color="red" 
                    onClick={(e, data) => linkSelect(selected)}
                >
                    {contracts[selected].details.title}
                </Label>
            </Breadcrumb.Section>
            {divider}
            </div>
        );
    });

    /*  */
    /* <Breadcrumb.Section>
        <Label as='a' color="red">Selected</Label>
    </Breadcrumb.Section>
    <Breadcrumb.Divider icon='right chevron' />
    <Breadcrumb.Section>
        <Label as='a' color="blue">InfoSys</Label>
    </Breadcrumb.Section>
    <Breadcrumb.Divider icon='right chevron' />
    <Breadcrumb.Section>
        <Label as='a' color="green" active>Current</Label>
    </Breadcrumb.Section> */

    return (
        <Breadcrumb>
            {sections}
        </Breadcrumb>
    );
};

const mapSelectionToContracts = (contracts) => {
    let selection = contracts.selected;
    let subset = {};
    selection.map((selected) => subset[selected] = contracts[selected]);
    return subset;
}

export const mapStateToProps = (state) => {
    return {
        selection: state.contracts.selected,
        contracts: mapSelectionToContracts(state.contracts)
    };
}

export const mapDispatchToProps = (dispatch) => {
    return {
        linkSelect: (address) => dispatch(actions.onLinkSelect(address))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LinkNav);