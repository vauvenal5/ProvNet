var LinkedListLib = artifacts.require("ethereum-libraries-linked-list/contracts/LinkedListLib.sol");
var ProvenanceLinkLibrary = artifacts.require("./libs/ProvenanceLinkLibrary.sol");
var ProvenanceLinkQueryLibrary = artifacts.require("./libs/ProvenanceLinkQueryLibrary.sol");
var TagLibrary = artifacts.require("./libs/TagLibrary.sol");
var ProvenanceLinkLibraryMock = artifacts.require("../contracts/mocks/ProvenanceLinkLibraryMock.sol");
//var ProvenanceLinkLibraryMock = artifacts.require("../test/mocks/ProvenanceLinkLibraryMock.sol");

module.exports = function(deployer, network) {
    if(network == "develop" || 
    network == "development" ||
    network == "test") {
        deployer.link(LinkedListLib, [ProvenanceLinkLibraryMock]);
        deployer.link(ProvenanceLinkLibrary, [ProvenanceLinkLibraryMock]);
        deployer.link(ProvenanceLinkQueryLibrary, [ProvenanceLinkLibraryMock]);
        deployer.link(TagLibrary, [ProvenanceLinkLibraryMock]);

        deployer.deploy(ProvenanceLinkLibraryMock);
    }
};
