export const types = {
    topMenuSelect: "TOP_MENU_SELECT",
    searchAddress: "SEARCH_ADDRESS",
};

export const onClick = (name) => ({
    type: types.topMenuSelect,
    name: name,
});

export const onSearchAddress = (address) => ({
    type: types.searchAddress,
    address: address,
});