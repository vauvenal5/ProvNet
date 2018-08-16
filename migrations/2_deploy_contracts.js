var SimpleProvenanceContract = artifacts.require("./contracts/SimpleProvenanceContract.sol");
var ProvenanceLinkLibrary = artifacts.require("./libs/ProvenanceLinkLibrary.sol");
var ProvenanceLinkQueryLibrary = artifacts.require("./libs/ProvenanceLinkQueryLibrary.sol");
var TagLibrary = artifacts.require("./libs/TagLibrary.sol");
var LinkedListLib = artifacts.require("ethereum-libraries-linked-list/contracts/LinkedListLib.sol");

var SwitchableRBACWithSuperuser = artifacts.require("./contracts/SwitchableRBACWithSuperuser.sol");
//var StringUtils

//var ProvenanceLinkLibraryMock2 = artifacts.require("./mocks/ProvenanceLinkLibraryMock2.sol");

//var ProvenanceLinkLibraryMock = artifacts.require("../contracts/mocks/ProvenanceLinkLibraryMock.sol");
//var Assert = artifacts.require("truffle/Assert.sol");

module.exports = function(deployer) {
  deployer.deploy(LinkedListLib);
  deployer.link(LinkedListLib, [
    ProvenanceLinkLibrary,
    ProvenanceLinkQueryLibrary, 
    SimpleProvenanceContract,
    TagLibrary]);
  //deployer.link(LinkedListLib, [ProvenanceLinkLibrary, SimpleProvenanceContract, ProvenanceLinkLibraryMock2]);
  //deployer.link(LinkedListLib, [ProvenanceLinkLibrary, SimpleProvenanceContract, ProvenanceLinkLibraryMock]);
  deployer.deploy(ProvenanceLinkLibrary);
  deployer.link(ProvenanceLinkLibrary, SimpleProvenanceContract);
  deployer.deploy(SimpleProvenanceContract);

  deployer.deploy(ProvenanceLinkQueryLibrary);

  deployer.deploy(SwitchableRBACWithSuperuser);

  deployer.deploy(TagLibrary);

  //deployer.deploy(ProvenanceLinkLibraryMock2);

  /*deployer.deploy(Assert);
  deployer.link(Assert, ProvenanceLinkLibraryMock);
  deployer.deploy(ProvenanceLinkLibraryMock);*/
};
