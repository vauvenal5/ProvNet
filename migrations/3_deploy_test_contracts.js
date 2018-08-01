var LinkedListLib = artifacts.require("ethereum-libraries-linked-list/contracts/LinkedListLib.sol");
var ProvenanceLinkLibraryMock = artifacts.require("./mocks/ProvenanceLinkLibraryMock.sol");

module.exports = function(deployer, network) {
    if(network == "development") {
        deployer.link(LinkedListLib, [ProvenanceLinkLibraryMock]);
        deployer.deploy(ProvenanceLinkLibraryMock);
    }
};
