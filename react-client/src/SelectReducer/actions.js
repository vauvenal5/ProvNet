import ContractBasedId from "../models/ContractBasedId";

export const types = {
    tagSelect: "TAG_SELECT",
    editUserSelect: "EDIT_USER_SELECT",
    editModelSelect: "EDIT_MODEL_SELECT"
};

export const onEditModelSelect = (address, id, payload) => ({
    //todo-sv: maybe change here to use COntractBasedId instead
    type: types.editModelSelect,
    address,
    id,
    payload
});

export const onTagSelect = (address, id, payload) => ({
    type: types.tagSelect,
    address: address,
    id: id,
    payload: payload
});

export const onEditUserSelect = (address, id, payload) => ({
    type: types.editUserSelect,
    address,
    id,
    payload
});