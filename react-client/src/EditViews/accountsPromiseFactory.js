export const metaMaskCallback = (resolve, reject) => (err, id) => {
    if(err) {
        reject(err);
    }
    resolve(id);
};

const accountsPromiseFactory = (web3) => new Promise((resolve, reject) => {
    web3.eth.getAccounts(metaMaskCallback(resolve, reject))
});

export default accountsPromiseFactory;