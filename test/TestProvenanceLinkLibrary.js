const ProvenanceLinkLibraryMock = artifacts.require("ProvenanceLinkLibraryMock");

contract('Provenance Link Library tests', async(accounts) => {
    it("should add link to list", async () => {
        let mock = await ProvenanceLinkLibraryMock.deployed();
        instance.addLink.call(0x126bF276bA4C7111dbddbb542718CfF678C9b3Ce, "test");
    });
})