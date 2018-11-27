import React, {Fragment} from 'react';
import EditModal from '../EditModal';
import { Container, Header } from 'semantic-ui-react';
import { connectWithDefault } from '../connectWithDefault';
import { withDefaultBehavior } from '../withDefaultBehavior';
import { modalPropsFrom } from '../EditModal/EditModal';
import { ProvRecordsMap, ProvRecordsSelector, ProvRecords } from '../../models';
import { dispatch } from 'rxjs/internal/observable/pairs';
import EditModel from '../../models/EditModel';

export const EditDetailsView = ({records = new ProvRecords(), ...props}) => {

    let recordsView = records.getRecords().map((value, index) => {
        return (
            <Fragment>
                <Header as="h3">Record #{index}</Header>
                <p>
                    {value}
                </p>
            </Fragment>
        );
    });

    return(
        <EditModal
            {...modalPropsFrom(
                props, 
                () => {}, 
                "Provenance Records",
                {
                    hidden: true
                }
            )}
            scrolling={true}
        >
            <Container text>
                {recordsView}
            </Container>
        </EditModal>
    );
}

export const mapStateToProps = (state) => {
    return {
        records: ProvRecordsSelector.getSelectedProvRecords(state)
    };
};

export const mergeProps = (stateProps, dispatchProps, ownProps) => {
    return ({
        onClose: () => {
            dispatchProps.onClose(
                stateProps.address,
                EditModel.getId(stateProps.editModel), 
                EditModel.getModal(stateProps.editModel)
            );

            if(EditModel.isSuccess(stateProps.editModel)) {
                dispatchProps.onClear(
                    stateProps.address,
                    EditModel.getId(stateProps.editModel),
                )
            }
        }
    });
}

export default connectWithDefault(mapStateToProps, undefined, mergeProps)(withDefaultBehavior(EditDetailsView));