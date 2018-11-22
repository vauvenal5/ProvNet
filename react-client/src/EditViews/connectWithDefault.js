import { connect } from 'react-redux';
import { withDefaultMap, withDefaultDispatch, withDefaultMerge } from './EditModal/EditModal';

export const connectWithDefault = (
    mapStateToProps = () => {}, 
    mapDispatchToProps = () => {}, 
    mergeProps = () => {}
) => {
    return connect(
        (state) => withDefaultMap(
            state, 
            mapStateToProps(state)
        ),
        (dispatch) => withDefaultDispatch(
            dispatch, 
            mapDispatchToProps(dispatch)
        ),
        (stateProps, dispatchProps, ownProps) => withDefaultMerge(
            stateProps, 
            dispatchProps, 
            ownProps, 
            mergeProps(stateProps, dispatchProps, ownProps)
        )
    );
}