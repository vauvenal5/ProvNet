var SimpleProvenanceContract = artifacts.require("./contracts/SimpleProvenanceContract.sol");
var ProvenanceLinkLibrary = artifacts.require("../contracts/libs/ProvLink/ProvLinkLib.sol");
var ProvenanceLinkQueryLibrary = artifacts.require("./libs/ProvLink/ProvLinkQueryLib.sol");
var TagLibrary = artifacts.require("./libs/TagLib.sol");
var LinkedListLib = artifacts.require("ethereum-libraries-linked-list/contracts/LinkedListLib.sol");
var LinkedListExtensionLib = artifacts.require("../contracts/libs/LinkedList/LinkedListExtensionLib.sol");
var LinkedListIteratorLib = artifacts.require("./libs/LinkedList/LinkedListIteratorLib.sol");

var SwitchableRBACWithSuperuser = artifacts.require("./contracts/SwitchableRBACWithSuperuser.sol");
//var StringUtils

//var ProvenanceLinkLibraryMock2 = artifacts.require("./mocks/ProvenanceLinkLibraryMock2.sol");

//var ProvenanceLinkLibraryMock = artifacts.require("../contracts/mocks/ProvenanceLinkLibraryMock.sol");
//var Assert = artifacts.require("truffle/Assert.sol");

module.exports = async function(deployer) {
  deployer.deploy(LinkedListLib);
  deployer.link(LinkedListLib, [
    ProvenanceLinkLibrary,
    ProvenanceLinkQueryLibrary, 
    SimpleProvenanceContract,
    LinkedListExtensionLib,
    TagLibrary]);
  
  deployer.deploy(LinkedListExtensionLib);
  deployer.link(LinkedListExtensionLib, [TagLibrary, ProvenanceLinkQueryLibrary]);

  deployer.deploy(LinkedListIteratorLib);
  deployer.link(LinkedListIteratorLib, [TagLibrary]);
  //deployer.link(LinkedListLib, [ProvenanceLinkLibrary, SimpleProvenanceContract, ProvenanceLinkLibraryMock2]);
  //deployer.link(LinkedListLib, [ProvenanceLinkLibrary, SimpleProvenanceContract, ProvenanceLinkLibraryMock]);
  deployer.deploy(ProvenanceLinkLibrary);

  deployer.deploy(ProvenanceLinkQueryLibrary);

  deployer.deploy(SwitchableRBACWithSuperuser);

  deployer.deploy(TagLibrary);

  deployer.link(ProvenanceLinkLibrary, [SimpleProvenanceContract]);
  deployer.link(TagLibrary, [SimpleProvenanceContract]);
  
  deployer.deploy(SimpleProvenanceContract).then(async(instance) => {
    await instance.setDescription("This is a TU Wien InfoSys Mock contract used for development. It is not affiliated with the TU Wien!");
    await instance.setLogoUrl("http://www.informatik.tuwien.ac.at/kontakt/INF_Logo_typo_grau_web_rgb.png");
  });
  
  deployer.deploy(SimpleProvenanceContract).then(async(instance) => {
    await instance.setDescription("This is a TU Wien Mock contract used for development. It is not affiliated with the TU Wien!");
    await instance.setLogoUrl("https://www.tuwien.ac.at/fileadmin/t/tuwien/downloads/cd/CD_NEU_2009/TU_Logos_2009/TUSignet.jpg");
  });

  //deployer.deploy(ProvenanceLinkLibraryMock2);

  /*deployer.deploy(Assert);
  deployer.link(Assert, ProvenanceLinkLibraryMock);
  deployer.deploy(ProvenanceLinkLibraryMock);*/
};
