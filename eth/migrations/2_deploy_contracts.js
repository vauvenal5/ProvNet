var utils = require("./DeployerUtils");
var SimpleProvenanceContract = artifacts.require("./contracts/SimpleProvenanceContract.sol");

var ProvenanceLinkLibrary = artifacts.require("../contracts/libs/ProvLink/ProvLinkLib.sol");
var ProvLinkListLib = artifacts.require("../contracts/libs/ProvLink/ProvLinkListLib.sol");
var ProvenanceLinkQueryLibrary = artifacts.require("./libs/ProvLink/ProvLinkQueryLib.sol");
var TagLibrary = artifacts.require("./libs/TagLib.sol");
var LinkedListLib = artifacts.require("ethereum-libraries-linked-list/contracts/LinkedListLib.sol");
var LinkedListExtensionLib = artifacts.require("../contracts/libs/LinkedList/LinkedListExtensionLib.sol");
var LinkedListIteratorLib = artifacts.require("./libs/LinkedList/LinkedListIteratorLib.sol");
var LinkedListAdvancedExtensionLib = artifacts.require("./libs/LinkedListAdvancedExtensionLib.sol");
var LinkableContract = artifacts.require("./contracts/LinkableContract");
var UrlLib = artifacts.require("./libs/UrlLib.sol");
var Uint256Utils = artifacts.require("./libs/Uint256Utils.sol");

var SwitchableRBACWithSuperuser = artifacts.require("./contracts/SwitchableRBACWithSuperuser.sol");
var UserAccessControl = artifacts.require("./contracts/UserAccessControl.sol");

module.exports = function(deployer, network, accounts) {
  //let utils = new Utils(artifacts, deployer);
  utils.initArtifacts(artifacts);
  utils.setDeployer(deployer);

  //todo-sv: do a clean analysis if the contract deployment is correct
  deployer.deploy(LinkedListLib);
  deployer.link(LinkedListLib, [
    ProvenanceLinkLibrary,
    ProvLinkListLib,
    ProvenanceLinkQueryLibrary, 
    SimpleProvenanceContract,
    LinkedListExtensionLib,
    TagLibrary,
    UserAccessControl,
    LinkedListAdvancedExtensionLib,
    LinkableContract,
    UrlLib
  ]);  

  deployer.deploy(LinkedListExtensionLib);
  deployer.link(LinkedListExtensionLib, [
    TagLibrary, 
    ProvenanceLinkQueryLibrary, 
    ProvenanceLinkLibrary, 
    ProvLinkListLib, 
    LinkedListAdvancedExtensionLib, 
    SimpleProvenanceContract
  ]);

  deployer.deploy(LinkedListIteratorLib);
  deployer.link(LinkedListIteratorLib, [TagLibrary]);
  
  deployer.deploy(LinkedListAdvancedExtensionLib);
  deployer.link(LinkedListAdvancedExtensionLib, [
    TagLibrary, 
    ProvLinkListLib, 
    SimpleProvenanceContract, 
    UserAccessControl, 
    LinkableContract,
    UrlLib
  ]);

  
  deployer.deploy(ProvenanceLinkQueryLibrary);
  deployer.deploy(SwitchableRBACWithSuperuser);
  
  deployer.deploy(TagLibrary);
  deployer.link(TagLibrary, [UserAccessControl, LinkableContract]);
  
  deployer.link(TagLibrary, [SimpleProvenanceContract, ProvenanceLinkLibrary]);

  deployer.deploy(ProvenanceLinkLibrary);
  deployer.link(ProvenanceLinkLibrary, [SimpleProvenanceContract, LinkableContract]);

  deployer.deploy(ProvLinkListLib);
  deployer.link(ProvLinkListLib, [SimpleProvenanceContract, LinkableContract]);

  deployer.deploy(UrlLib);
  deployer.link(UrlLib, [SimpleProvenanceContract]);

  var description = "This is a TU Wien InfoSys Mock contract used for development. It is not affiliated with the TU Wien!";
  var logoUrl = "http://www.informatik.tuwien.ac.at/kontakt/INF_Logo_typo_grau_web_rgb.png";

  let dsg;
  let infoSys;
  let tuwien;
  let inst1;
  
  // if(network === "develop" || network === "ui") {
  //   dsg = utils.deploySimpleProvenanceContract("DSG", "This is a TU Wien DSG Mock contract used for development. It is not affiliated with the TU Wien!", "http://dsg.tuwien.ac.at/images/dsg-logo.jpg", accounts);

  //   infoSys = utils.deploySimpleProvenanceContract("InfoSys", "This is a TU Wien InfoSys Mock contract used for development. It is not affiliated with the TU Wien!", "http://www.informatik.tuwien.ac.at/kontakt/INF_Logo_typo_grau_web_rgb.png", accounts);

  //   tuwien = utils.deploySimpleProvenanceContract("TUWien", "This is a TU Wien Mock contract used for development. It is not affiliated with the TU Wien!", "https://www.tuwien.ac.at/fileadmin/t/tuwien/downloads/cd/CD_NEU_2009/TU_Logos_2009/TUSignet.jpg", accounts);

  //   inst1 = utils.deployInstituteWithGroups(5, "Inst-1", "Group-", accounts);
  // }

  //this one is the last contract on purpose so that this contracts address is written into the SimpleProvenanceContract json file!
  let svidenov = utils.deploySimpleProvenanceContract("svidenov", "This is the contract of the ProvNet developer.", "https://avatars3.githubusercontent.com/u/1935503?s=460&v=4", accounts);

  // if(network === "develop" || network === "ui") {
  //   infoSys.twoWayLink(dsg, 1, 1);
    
  //   tuwien.twoWayLink(infoSys, 1, 1);
  //   tuwien.twoWayLink(inst1.inst, 1, 1);

  //   svidenov.addLink(tuwien, 2);
  //   svidenov.addLink(infoSys, 2);
  //   svidenov.addLink(dsg, 2);

  //   inst1.inst.addProvenance("https://find.this.com/resource1", "some prov");
  //   inst1.groups[2].addProvenance("https://find.this.com/resource1", "some more prov");
  //   inst1.groups[4].addProvenance("https://find.this.com/resource1", "and even more prov");

  //   utils.printContractAddresses();
  // }
  utils.printContractAddresses();
};
