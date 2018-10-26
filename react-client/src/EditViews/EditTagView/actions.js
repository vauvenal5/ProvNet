import { Tag } from "./imports";

export const types = {
    editTag: "EDIT_TAG",
    nop: "NO_OPERATION"
}

export const onEditTag = (address, tagId, title) => ({
    type: types.editTag,
    address: address,
    tag: new Tag(tagId, title)
});

export const onNop = () => ({
    type: types.nop
});