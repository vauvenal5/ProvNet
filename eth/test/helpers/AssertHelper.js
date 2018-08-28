module.exports = {
    assertLink: (async function(mock, expectedAddress, expectedType, expectedListSize) {
        this.assertListSize(mock, expectedListSize);
        
        let link = await mock.getLink.call(expectedAddress, [expectedType]);

        assert.equal(link[0], expectedAddress, "Link address");
        assert.equal(link[1].length, 1, "Link types number");
        assert.equal(link[1][0], true, "Link type");
        assert.equal(link[2], true, "Link index exists");
    }),
    assertListSize: (async function(mock, expectedListSize) {
        assert.equal(await mock.getListSize.call(), expectedListSize, "Link list has the correct length");
    }),
    assertLinkHasProvenance: (async (mock, expectedAddress, expectedUrl) => {
        let hasProvenance = await mock.isLinkHasProvenance.call(expectedAddress, expectedUrl);
        assert.isTrue(hasProvenance, "Link hasProvenance for url is set");
    }),
    assertLinkHasNoProvenance: (async (mock, expectedAddress, expectedUrl) => {
        let hasProvenance = await mock.isLinkHasProvenance.call(expectedAddress, expectedUrl);
        assert.isFalse(hasProvenance, "Link hasProvenance for url is cleared");
    })
}