import React, {Fragment} from 'react';
import { connect } from 'react-redux';
import { Breadcrumb, Label } from 'semantic-ui-react';
import * as actions from '../modelActions';
import { SelectSelector } from '../models';
import ProvContractSelector from '../models/selectors/ProvContractSelector';

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
    return {
        selection: SelectSelector.getSelectedList(state),
        titles: ProvContractSelector.getLinkSelectedContractTitles(state)
    };
}

export const mapDispatchToProps = (dispatch) => {
    return {
        linkSelect: (address) => dispatch(actions.onLinkSelect(address))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LinkNav);