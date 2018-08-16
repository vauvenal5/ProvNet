const ProvenanceLinkLibraryMock = artifacts.require("./mocks/ProvenanceLinkLibraryMock");
//const ProvenanceLinkLibraryMock = artifacts.require("./mocks/ProvenanceLinkLibraryMock2");

const assertHelper = require("./helpers/AssertHelper.js");

contract('ProvenanceLinkLibrary', async(accounts) => {
    it("should add link to list", async () => {
        let expectedAddress = accounts[0];
        let expectedType = 1;
        let mock = await ProvenanceLinkLibraryMock.new();
        await mock.addLink.sendTransaction(expectedAddress, expectedType);

        await assertHelper.assertLink(mock, expectedAddress, expectedType, 1);
    });

    it("should set and clear link has provenance", async () => {
        let expectedAddress = accounts[1];
        let expectedType = 1;
        let expectedUrl = "https://github.com/vauvenal5/ProvNet/commit/d463c219812aa8a4328abc1053afdbcc93317657";
                
        let mock = await ProvenanceLinkLibraryMock.new();

        await mock.addLink(expectedAddress, expectedType);

        await assertHelper.assertLink(mock, expectedAddress, expectedType, 1);

        await mock.setLinkHasProvenance(expectedAddress, expectedUrl, true);
        await assertHelper.assertLinkHasProvenance(mock, expectedAddress, expectedUrl);

        await mock.setLinkHasProvenance(expectedAddress, expectedUrl, false);

        await assertHelper.assertLinkHasNoProvenance(mock, expectedAddress, expectedUrl);
    });

    it("should add link and set has provenance", async () => {
        let expectedAddress = accounts[0];
        let expectedType = 1;
        let expectedUrl = "https://github.com/vauvenal5/ProvNet/commit/d463c219812aa8a4328abc1053afdbcc93317657";

        let mock = await ProvenanceLinkLibraryMock.new();

        await mock.addLinkWithProvenance(expectedAddress, expectedType, expectedUrl);

        await assertHelper.assertLink(mock, expectedAddress, expectedType, 1);
        await assertHelper.assertLinkHasProvenance(mock, expectedAddress, expectedUrl);
    });

    it("should return the correct amount of links by type", async () => {
        let mock = await ProvenanceLinkLibraryMock.new();
        await mock.addLink(accounts[0], 1);
        await mock.addLink(accounts[1], 2);
        await mock.addLink(accounts[2], 1);
        await mock.addLink(accounts[3], 2);
        await mock.addLink(accounts[4], 1);

        await assertHelper.assertListSize(mock, 5);

        assert.equal(await mock.getLinkCountForType.call(1), 3, "Correct number of test-types exist");
        assert.equal(await mock.getLinkCountForType.call(2), 2, "Correct number of test1-types exist");
    });

    it("should return the correct amount of links by url", async () => {
        let expectedUrl = "https://github.com/vauvenal5/ProvNet/commit/d463c219812aa8a4328abc1053afdbcc93317657";

        let mock = await ProvenanceLinkLibraryMock.new();
        await mock.addLink(accounts[0], 1);
        await mock.addLinkWithProvenance(accounts[1], 2, expectedUrl);
        await mock.addLinkWithProvenance(accounts[2], 1, expectedUrl);
        await mock.addLink(accounts[3], 2);
        await mock.addLinkWithProvenance(accounts[4], 1, expectedUrl);

        await assertHelper.assertListSize(mock, 5);

        assert.equal(await mock.getLinkCountForUrl.call(expectedUrl), 3, "Correct number of has provenance is set");
    });

    it("should return the correct link addresses by type", async () => {

        let mock = await ProvenanceLinkLibraryMock.new();
        await mock.addLink(accounts[0], 1);
        await mock.addLink(accounts[1], 2);
        await mock.addLink(accounts[2], 1);
        await mock.addLink(accounts[3], 2);
        await mock.addLink(accounts[4], 1);

        await assertHelper.assertListSize(mock, 5);

        let addresses = await mock.getLinkListForType.call(1);

        assert.include(addresses, accounts[0], "Could not find address in list");
        assert.include(addresses, accounts[2], "Could not find address in list");
        assert.include(addresses, accounts[4], "Could not find address in list");
    });
})