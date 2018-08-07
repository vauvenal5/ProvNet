var LinkedListLib = artifacts.require("ethereum-libraries-linked-list/contracts/LinkedListLib.sol");
var ProvenanceLinkLibrary = artifacts.require("./libs/ProvenanceLinkLibrary.sol");
var ProvenanceLinkLibraryMock = artifacts.require("./mocks/ProvenanceLinkLibraryMock.sol");
//var ProvenanceLinkLibraryMock = artifacts.require("../test/mocks/ProvenanceLinkLibraryMock2.sol");

module.exports = function(deployer, network) {
    if(network == "develop") {
        deployer.link(LinkedListLib, [ProvenanceLinkLibraryMock]);
        deployer.link(ProvenanceLinkLibrary, [ProvenanceLinkLibraryMock]);
        deployer.deploy(ProvenanceLinkLibraryMock);
    }
};
