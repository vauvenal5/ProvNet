var SimpleProvenanceContract = artifacts.require("./SimpleProvenanceContract.sol");
var ProvenanceLinkLibrary = artifacts.require("./ProvenanceLinkLibrary.sol");
var LinkedListLib = artifacts.require("ethereum-libraries-linked-list/contracts/LinkedListLib.sol");

//var ProvenanceLinkLibraryMock2 = artifacts.require("./mocks/ProvenanceLinkLibraryMock2.sol");

//var ProvenanceLinkLibraryMock = artifacts.require("../contracts/mocks/ProvenanceLinkLibraryMock.sol");
//var Assert = artifacts.require("truffle/Assert.sol");

module.exports = function(deployer) {
  deployer.deploy(LinkedListLib);
  deployer.link(LinkedListLib, [ProvenanceLinkLibrary, SimpleProvenanceContract]);
  //deployer.link(LinkedListLib, [ProvenanceLinkLibrary, SimpleProvenanceContract, ProvenanceLinkLibraryMock2]);
  //deployer.link(LinkedListLib, [ProvenanceLinkLibrary, SimpleProvenanceContract, ProvenanceLinkLibraryMock]);
  deployer.deploy(ProvenanceLinkLibrary);
  deployer.link(ProvenanceLinkLibrary, SimpleProvenanceContract);
  deployer.deploy(SimpleProvenanceContract);

  //deployer.deploy(ProvenanceLinkLibraryMock2);

  /*deployer.deploy(Assert);
  deployer.link(Assert, ProvenanceLinkLibraryMock);
  deployer.deploy(ProvenanceLinkLibraryMock);*/
};
