const ProvenanceLinkLibraryMock = artifacts.require("./ProvenanceLinkLibraryMock");

assertLink = (async function(mock, expectedAddress, expectedType, expectedListSize) {
        var link = await mock.getLink.call(expectedAddress);

        assert.equal(link[0], expectedAddress, "Link address");
        assert.equal(link[1], expectedType, "Link type");
        assert.equal(link[2], true, "Link index exists");
        assert.equal(link[3], expectedListSize, "Link list has the correct length");
});

assertLinkHasProvenance = (async (mock, expectedAddress, expectedUrl) => {
    let hasProvenance = await mock.isLinkHasProvenance.call(expectedAddress, expectedUrl);
    assert.isTrue(hasProvenance, "Link hasProvenance for url is set");
});

assertLinkHasNoProvenance = (async (mock, expectedAddress, expectedUrl) => {
    let hasProvenance = await mock.isLinkHasProvenance.call(expectedAddress, expectedUrl);
    assert.isFalse(hasProvenance, "Link hasProvenance for url is cleared");
});

contract('ProvenanceLinkLibrary', async(accounts) => {
    it("should add link to list", async () => {
        let expectedAddress = accounts[0];
        let expectedType = "test";
        let mock = await ProvenanceLinkLibraryMock.new();

        await mock.addLink.sendTransaction(expectedAddress, expectedType);
        
        assertLink(mock, expectedAddress, expectedType, 1);
    });

    it("should set and clear link has provenance", async () => {
        let expectedAddress = accounts[1];
        let expectedType = "test";
        let expectedUrl = "https://github.com/vauvenal5/ProvNet/commit/d463c219812aa8a4328abc1053afdbcc93317657";
                
        let mock = await ProvenanceLinkLibraryMock.new();

        await mock.addLink(expectedAddress, expectedType);

        assertLink(mock, expectedAddress, expectedType, 1);

        await mock.setLinkHasProvenance(expectedAddress, expectedUrl, true);

        assertLinkHasProvenance(mock, expectedAddress, expectedUrl);

        await mock.setLinkHasProvenance(expectedAddress, expectedUrl, false);

        assertLinkHasNoProvenance(mock, expectedAddress, expectedUrl);
    });
})