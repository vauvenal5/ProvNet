const StringUtilsLibraryMock = artifacts.require("../contracts/mocks/StringUtilsLibraryMock.sol");

contract('StringUtils', async(accounts) => {
    it("should compare equal strings correctly", async () => {
        let mock = await StringUtilsLibraryMock.new();
        assert.isTrue(await mock.equalHashWithLengthCheck.call("test", "test"), "Strings should be equal");
    });

    it("should compare not equal strings correctly", async () => {
        let mock = await StringUtilsLibraryMock.new();
        assert.isFalse(await mock.equalHashWithLengthCheck.call("test", "tett"), "Strings should not be equal");
    });

    it("should compare strings of different length correctly", async () => {
        let mock = await StringUtilsLibraryMock.new();
        assert.isFalse(await mock.equalHashWithLengthCheck.call("test", "test1"), "Strings should not be equal");
    });
})