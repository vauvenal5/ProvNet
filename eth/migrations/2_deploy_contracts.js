var utils = require("./DeployerUtils");
var SimpleProvenanceContract = artifacts.require("./contracts/SimpleProvenanceContract.sol");

var LinkedListLib = artifacts.require("ethereum-libraries-linked-list/contracts/LinkedListLib.sol");
var LinkedListExtensionLib = artifacts.require("../contracts/libs/LinkedList/LinkedListExtensionLib.sol");
var LinkedListAdvancedExtensionLib = artifacts.require("./libs/LinkedListAdvancedExtensionLib.sol");

var ProvLinkLib = artifacts.require("../contracts/libs/ProvLink/ProvLinkLib.sol");
var ProvLinkListLib = artifacts.require("../contracts/libs/ProvLink/ProvLinkListLib.sol");

var TagLibrary = artifacts.require("./libs/TagLib.sol");
var UrlLib = artifacts.require("./libs/UrlLib.sol");

module.exports = function(deployer, network, accounts) {
    utils.initArtifacts(artifacts);
    utils.setDeployer(deployer);

    deployer.deploy(LinkedListLib);
    deployer.link(LinkedListLib, [
        LinkedListAdvancedExtensionLib,
        LinkedListExtensionLib,
        ProvLinkLib,
        ProvLinkListLib,
        SimpleProvenanceContract,
        TagLibrary,
        UrlLib
    ]);  

    deployer.deploy(LinkedListExtensionLib);
    deployer.link(LinkedListExtensionLib, [
        TagLibrary, 
        ProvLinkLib, 
        ProvLinkListLib, 
        LinkedListAdvancedExtensionLib, 
        SimpleProvenanceContract
    ]);

    deployer.deploy(LinkedListAdvancedExtensionLib);
    deployer.link(LinkedListAdvancedExtensionLib, [
        TagLibrary, 
        ProvLinkListLib, 
        SimpleProvenanceContract, 
        UrlLib
    ]);

    deployer.deploy(TagLibrary);
    deployer.link(TagLibrary, [
        SimpleProvenanceContract, 
        ProvLinkLib
    ]);

    deployer.deploy(ProvLinkLib);
    deployer.link(ProvLinkLib, [
        SimpleProvenanceContract, 
    ]);

    deployer.deploy(ProvLinkListLib);
    deployer.link(ProvLinkListLib, [
        SimpleProvenanceContract, 
    ]);

    deployer.deploy(UrlLib);
    deployer.link(UrlLib, [
        SimpleProvenanceContract
    ]);

    let svidenov = utils.deploySimpleProvenanceContract("svidenov", "This is the contract of the ProvNet developer.", "https://avatars3.githubusercontent.com/u/1935503?s=460&v=4", accounts);

    utils.printContractAddresses();
};
