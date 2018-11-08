import React, {Fragment} from 'react';
import { connect } from 'react-redux';
import { Breadcrumb, Label } from 'semantic-ui-react';
import * as actions from '../modelActions';
import Select from '../models/Select';
import { RootSelector, ProvContractList, ContractDetails, ProvContract } from '../models';

export const LinkNav = ({selection, titles, linkSelect}) => {
    
    let sections = selection.map((selected, index) => {
        let divider = "";
        if(index < (selection.length-1)) {
            divider = (<Breadcrumb.Divider icon='right chevron' />);
        }

        return (
            <Fragment key={index}>
                <Breadcrumb.Section key={selected}>
                    <Label as='a' color="grey" 
                        onClick={(e, data) => linkSelect(selected)}
                    >
                        {titles[index]}
                    </Label>
                </Breadcrumb.Section>
                {divider}
            </Fragment>
        );
    });

    return (
        <Breadcrumb>
            {sections}
        </Breadcrumb>
    );
};

export const mapStateToProps = (state) => {
    let selection = Select.getSelectedList(RootSelector.getSelect(state));
    return {
        selection: selection,
        titles: selection.map(selected => ContractDetails.getTitle(
            ProvContract.getDetails(
                ProvContractList.getContract(RootSelector.getContracts(state), selected)
            )
        ))
    };
}

export const mapDispatchToProps = (dispatch) => {
    return {
        linkSelect: (address) => dispatch(actions.onLinkSelect(address))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LinkNav);