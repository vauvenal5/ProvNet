import * as modelActions from "../modelActions";

const detailsViewReducer = (state={}, action) => {
    switch(action.type) {
        case modelActions.types.contractSelect:
            return Object.assign({}, state, {
                selected: action.address
            });
        default:
            return state;
    }
}

export default detailsViewReducer;