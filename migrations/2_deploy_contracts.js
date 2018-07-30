var SimpleProvenanceContract = artifacts.require("./SimpleProvenanceContract.sol");
var ProvenanceLinkLibrary = artifacts.require("../contracts/ProvenanceLinkLibrary.sol");

module.exports = function(deployer) {
  deployer.deploy(ProvenanceLinkLibrary);
  deployer.link(ProvenanceLinkLibrary, SimpleProvenanceContract);
  deployer.deploy(SimpleProvenanceContract);
};
