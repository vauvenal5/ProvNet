const SimpleProvenanceContract = artifacts.require("SimpleProvenanceContract.sol");

const userHelper = require('./helpers/UserHelper');

contract("SimpleProvenanceContract", async([owner, account]) => {
    var mock;

    beforeEach(async function() {
        mock = await SimpleProvenanceContract.new();
    });

    context("provenance", async() => {
        it("should have URI after put", async() => {
            console.log(account);
            userHelper.addUser(mock, account, "editor", owner);
            await mock.putProvenanceRecord(
                "test", "test", {from: account}
            );
            await mock.putProvenanceRecord(
                "test2", "test2", {from: account}
            );
            console.log("URL TEST:")
            let res = await mock.getUrls();
            console.log(res);
            res = await mock.getProvenanceRecords("test");
            console.log(res);
        });
    });
});