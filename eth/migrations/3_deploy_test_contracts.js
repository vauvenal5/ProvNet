var LinkedListLib = artifacts.require("ethereum-libraries-linked-list/contracts/LinkedListLib.sol");
var ProvenanceLinkLibrary = artifacts.require("./libs/ProvLink/ProvLinkLib.sol");
var ProvenanceLinkQueryLibrary = artifacts.require("./libs/ProvLink/ProvLinkQueryLib.sol");
var TagLibrary = artifacts.require("./libs/TagLib.sol");
var ProvenanceLinkLibraryMock = artifacts.require("../contracts/mocks/ProvenanceLinkLibraryMock.sol");
var LinkedListExtensionLib = artifacts.require("./libs/LinkedList/LinkedListExtensionLib.sol");
//var ProvenanceLinkLibraryMock = artifacts.require("../test/mocks/ProvenanceLinkLibraryMock.sol");

module.exports = function(deployer, network) {
    if(network == "develop" || 
    network == "development" ||
    network == "test") {
        deployer.link(LinkedListLib, [ProvenanceLinkLibraryMock]);
        deployer.link(ProvenanceLinkLibrary, [ProvenanceLinkLibraryMock]);
        deployer.link(ProvenanceLinkQueryLibrary, [ProvenanceLinkLibraryMock]);
        deployer.link(TagLibrary, [ProvenanceLinkLibraryMock]);
        deployer.link(LinkedListExtensionLib, [ProvenanceLinkLibraryMock]);

        deployer.deploy(ProvenanceLinkLibraryMock);
    }
};
