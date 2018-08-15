var LinkedListLib = artifacts.require("ethereum-libraries-linked-list/contracts/LinkedListLib.sol");
var ProvenanceLinkLibrary = artifacts.require("./libs/ProvenanceLinkLibrary.sol");
var ProvenanceLinkLibraryMock = artifacts.require("../contracts/mocks/ProvenanceLinkLibraryMock.sol");
//var ProvenanceLinkLibraryMock = artifacts.require("../test/mocks/ProvenanceLinkLibraryMock.sol");

module.exports = function(deployer, network) {
    if(network == "develop" || 
    network == "development" ||
    network == "test") {
        deployer.link(LinkedListLib, [ProvenanceLinkLibraryMock]);
        deployer.link(ProvenanceLinkLibrary, [ProvenanceLinkLibraryMock]);

        deployer.deploy(ProvenanceLinkLibraryMock);
    }
};
