export const metaMaskCallback = (resolve, reject) => (err, id) => {
    if(err) {
        reject(err);
    }
    resolve(id);
};

export const MetaMaskPromiseFactory = {
    accountsPromise: (web3) => new Promise((resolve, reject) => {
        web3.eth.getAccounts(metaMaskCallback(resolve, reject))
    }),
    networkIdPromise: (web3) => new Promise((resolve, reject) => {
        web3.eth.net.getId(metaMaskCallback(resolve, reject))
    })
};

export default MetaMaskPromiseFactory;