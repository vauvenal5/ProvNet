var SimpleProvenanceContract = artifacts.require("./contracts/SimpleProvenanceContract.sol");

var ProvenanceLinkLibrary = artifacts.require("../contracts/libs/ProvLink/ProvLinkLib.sol");
var ProvLinkListLib = artifacts.require("../contracts/libs/ProvLink/ProvLinkListLib.sol");
var ProvenanceLinkQueryLibrary = artifacts.require("./libs/ProvLink/ProvLinkQueryLib.sol");
var TagLibrary = artifacts.require("./libs/TagLib.sol");
var LinkedListLib = artifacts.require("ethereum-libraries-linked-list/contracts/LinkedListLib.sol");
var LinkedListExtensionLib = artifacts.require("../contracts/libs/LinkedList/LinkedListExtensionLib.sol");
var LinkedListIteratorLib = artifacts.require("./libs/LinkedList/LinkedListIteratorLib.sol");

var SwitchableRBACWithSuperuser = artifacts.require("./contracts/SwitchableRBACWithSuperuser.sol");

const deploySimpleProvenanceContract = (deployer, title, description, logoUrl, accounts) => {
  let contract = {};

  deployer.deploy(SimpleProvenanceContract).then((instance) => {
    contract.instance = instance;
  });

  deployer.then(() => {
    return contract.instance.setTitle(title);
  }).then(() => {
    return contract.instance.setDescription(description);
  }).then(() => {
    return contract.instance.setLogoUrl(logoUrl);
  }).then(() => {
    return contract.instance.addUser(accounts[0], "trusted");
  }).then(() => {
    return contract.instance.addUser(accounts[0], "known");
  });

  return contract;
};

const addLink = (deployer, linker, linked, type) => {
  deployer.then(() => {
    return linker.instance.addLink(linked.instance.address, type);
  });
};

module.exports = function(deployer, network, accounts) {
  deployer.deploy(LinkedListLib);
  deployer.link(LinkedListLib, [
    ProvenanceLinkLibrary,
    ProvLinkListLib,
    ProvenanceLinkQueryLibrary, 
    SimpleProvenanceContract,
    LinkedListExtensionLib,
    TagLibrary
  ]);
  
  deployer.deploy(LinkedListExtensionLib);
  deployer.link(LinkedListExtensionLib, [TagLibrary, ProvenanceLinkQueryLibrary, ProvenanceLinkLibrary, ProvLinkListLib]);

  deployer.deploy(LinkedListIteratorLib);
  deployer.link(LinkedListIteratorLib, [TagLibrary]);

  
  deployer.deploy(ProvenanceLinkQueryLibrary);
  deployer.deploy(SwitchableRBACWithSuperuser);
  deployer.deploy(TagLibrary);

  
  deployer.link(TagLibrary, [SimpleProvenanceContract, ProvenanceLinkLibrary]);

  deployer.deploy(ProvenanceLinkLibrary);
  deployer.link(ProvenanceLinkLibrary, [SimpleProvenanceContract]);

  deployer.deploy(ProvLinkListLib);
  deployer.link(ProvLinkListLib, [SimpleProvenanceContract]);

  var description = "This is a TU Wien InfoSys Mock contract used for development. It is not affiliated with the TU Wien!";
  var logoUrl = "http://www.informatik.tuwien.ac.at/kontakt/INF_Logo_typo_grau_web_rgb.png";

  let dsg;
  let infoSys;
  let tuwien;
  
  if(network === "develop") {
    dsg = deploySimpleProvenanceContract(deployer, "DSG", "This is a TU Wien DSG Mock contract used for development. It is not affiliated with the TU Wien!", "http://dsg.tuwien.ac.at/images/dsg-logo.jpg", accounts);

    infoSys = deploySimpleProvenanceContract(deployer, "InfoSys", "This is a TU Wien InfoSys Mock contract used for development. It is not affiliated with the TU Wien!", "http://www.informatik.tuwien.ac.at/kontakt/INF_Logo_typo_grau_web_rgb.png", accounts);

    tuwien = deploySimpleProvenanceContract(deployer, "TUWien", "This is a TU Wien Mock contract used for development. It is not affiliated with the TU Wien!", "https://www.tuwien.ac.at/fileadmin/t/tuwien/downloads/cd/CD_NEU_2009/TU_Logos_2009/TUSignet.jpg", accounts);
  }

  //this one is the last contract on purpose so that this contracts address is written into the SimpleProvenanceContract json file!
  let svidenov = deploySimpleProvenanceContract(deployer, "svidenov", "This is the contract of the ProvNet developer.", "https://www.tuwien.ac.at/fileadmin/t/tuwien/downloads/cd/CD_NEU_2009/TU_Logos_2009/TUSignet.jpg", accounts);

  if(network === "develop") {
    addLink(deployer, dsg, infoSys, 1);
    addLink(deployer, infoSys, dsg, 1);
    
    addLink(deployer, infoSys, tuwien, 1);
    addLink(deployer, tuwien, infoSys, 1);

    addLink(deployer, svidenov, tuwien, 2);
    addLink(deployer, svidenov, infoSys, 2);
    addLink(deployer, svidenov, dsg, 2);

    deployer.then(() => {
      console.log("DSG: " + dsg.instance.address);
      console.log("InfoSys: " + infoSys.instance.address);
      console.log("TUWien: " + tuwien.instance.address);
      console.log("svidenov: " + svidenov.instance.address);
    });
  }
};


