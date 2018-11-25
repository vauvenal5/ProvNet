const SimpleProvenanceContract = artifacts.require("SimpleProvenanceContract.sol");

const userHelper = require('./helpers/UserHelper');

contract("SimpleProvenanceContract", async([owner, accounts]) => {
    var mock;

    beforeEach(async function() {
        mock = await SimpleProvenanceContract.new();
    });

    context("provenance", async() => {
        it("should have URI after put", async() => {
            //console.log(accounts);
            //userHelper.addUser(mock, accounts, "bla", accounts);
            await mock.putProvenanceRecord(
                "test", "test", {from: accounts}
            );
            console.log("URL TEST:")
            let res = await mock.getUrls();
            console.log(res);
            res = await mock.getProvenanceRecordLength("test");
            console.log(res);
        });
    });
});