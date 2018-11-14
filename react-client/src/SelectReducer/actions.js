export const types = {
    tagSelect: "TAG_SELECT",
};

export const onTagSelect = (address, id, payload) => ({
    type: types.tagSelect,
    address: address,
    id: id,
    payload: payload
});