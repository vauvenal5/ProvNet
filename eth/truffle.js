/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a 
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() { 
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>') 
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    ui: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*"
    },
  //   coverage: {
  //     host: "localhost",
  //     network_id: "*",
  //     port: 8555,         // <-- If you change this, also set the port option in .solcover.js.
  //     gas: 0xfffffffffff, // <-- Use this high gas value
  //     gasPrice: 0x01      // <-- Use this low gas price
  //   },
  },
  build: function(options, callback) {
    var fs = require('fs');
    let target = options.build_directory + "/linked"
    
    if (!fs.existsSync(target)){
      fs.mkdirSync(target);
    }
    
    var json = require("./build/contracts/SimpleProvenanceContract.json");
    var contract = require("truffle-contract");
    var SimpleProvenanceContract = contract(json);

    let output = {
      contractName: SimpleProvenanceContract.contractName,
      truffle: json,
      binary: {}
    };

    for(var network in json.networks){
      SimpleProvenanceContract.setNetwork(network);
    
      output.binary[network] = SimpleProvenanceContract.binary;
    }

    fs.writeFile(
      target+"/"+output.contractName+".json",
      JSON.stringify(output, null, 4), (err) => {
        if(err) {
          console.log(err);
        }
        callback();
    });
  }
};
