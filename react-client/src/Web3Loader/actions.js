export const types = {
    initWeb3: "INIT_WEB3",
    initWeb3Success: "INIT_WEB3_SUCCESS",
    initWeb3Failed: "INIT_WEB3_FAILED",
};

export const startInit = (address, uri) => ({
    type: types.initWeb3,
    address: address,
    uri: uri
    //web3: web3,
});

export const initSuccess = (web3) => ({
    type: types.initWeb3Success,
    web3: web3
});

export const initFailed = (err)  => ({
    type: types.initWeb3Failed,
    error: err,
});