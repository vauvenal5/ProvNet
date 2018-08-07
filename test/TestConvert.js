const AddressUtilsLibraryMock = artifacts.require("../contracts/mocks/AddressUtilsMock.sol");
const Uint256UtilsMock = artifacts.require("../contracts/mocks/Uint256UtilsMock.sol");

contract('AddressUtils/Uint256Utils conversion', async(accounts) => {
    it("should convert correctly", async () => {
        let addressMock = await AddressUtilsLibraryMock.new();
        let uintMock = await Uint256UtilsMock.new();

        let num = await addressMock.convert.call(accounts[0]);
        let actual = await uintMock.convert.call(num);

        assert.equal(actual, accounts[0], "Conversion to uint and back not correct");
    });
})