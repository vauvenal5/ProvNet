import { Tag } from "./imports";

export const types = {
    editTag: "EDIT_TAG",
    nop: "NO_OPERATION",
    editTagModalOpen: "EDIT_TAG_MODAL_OPEN",
    editTagError: "EDIT_TAG_MODAL_ERROR",
    editTagSuccess: "EDIT_TAG_MODAL_SUCCESS",
    editTagModalClear: "EDIT_TAG_MODAL_CLEAR",
}

export const onEditTag = (address, tagId, title) => ({
    type: types.editTag,
    address: address,
    tagId: tagId,
    title: title
});

export const onNop = () => ({
    type: types.nop
});

export const onEditTagModalOpen = (value, address, id) => ({
    type: types.editTagModalOpen,
    value: value,
    address: address,
    tagId: id
})

export const onEditTagModalClear = (address, id) => ({
    type: types.editTagModalClear,
    address: address,
    tagId: id
})

export const onEditTagSuccess = (address, id) => ({
    type: types.editTagSuccess,
    address: address,
    tagId: id
})

export const onEditTagError = (address, id, error) => ({
    type: types.editTagError,
    address: address,
    tagId: id,
    error: error
})