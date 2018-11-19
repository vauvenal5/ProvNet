export const types = {
    tagSelect: "TAG_SELECT",
    editUserSelect: "EDIT_USER_SELECT"
};

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