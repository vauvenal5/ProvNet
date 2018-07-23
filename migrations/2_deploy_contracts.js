var SimpleProvenanceContract = artifacts.require("./SimpleProvenanceContract.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleProvenanceContract);
};
