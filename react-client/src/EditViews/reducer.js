import { ofType, combineEpics } from "redux-observable";
import { map, delay } from "rxjs/operators";

import ContractEditModelMap from "../models/maps/ContractEditModelMap";
import * as actions from "./actions";
import EditModelMap from "../models/maps/EditModelMap";
import EditModel from "../models/EditModel";
import { epic as editTagEpic } from "./EditTagView";
import { epic as deployContractEpic } from "./DeployContract";
import { epic as editDetailsEpic } from "./EditDetailsView";

export const editSuccessEpic = (action$) => action$.pipe(
    ofType(actions.types.editSuccessAutoClear),
    delay(1000),
    map(action => actions.onEditModalClear(action.address, action.id))
);

export const mapEditToRealEditEpic = (action$) => action$.pipe(
    ofType(actions.types.edit),
    map(action => action.payload)
);

export const epic = combineEpics(
    editTagEpic, 
    editSuccessEpic, 
    deployContractEpic, 
    editDetailsEpic,
    mapEditToRealEditEpic
);

export const reducer = (
    state = new ContractEditModelMap("editModels"),
    action
) => {
    let map = ContractEditModelMap.get(state, action.address);
    let model = EditModelMap.get(map, action.id);

    switch(action.type) {
        case actions.types.edit:
            model = EditModel.setLoading(model);
            break;
        case actions.types.editError:
            model = EditModel.setError(model, action.error);
            break;
        case actions.types.editSuccess:
        case actions.types.editSuccessAutoClear:
            model = EditModel.setSuccess(model, action.payload);
            break;
        case actions.types.deployContractModalOpen:
        case actions.types.editModalOpen:
            model = EditModel.setModalOpen(model, action.modal, action.value);
            state = state.setSelected(action.address, action.id);
            break;
        case actions.types.editModalClear:
            model = EditModel.setCleared(model);
            break;
        default:
            return state;
    }

    return ContractEditModelMap.add(state, action.address, model);
};