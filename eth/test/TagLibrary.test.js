const TagLibMock = artifacts.require("./mocks/TagLibMock");

contract('TagLib', async(accounts) => {
    it("should add three tags", async () => {
        let mock = await TagLibMock.new();
        mock.addTag(1, "trusted");
        mock.addTag(2, "known");
        mock.addTag(3, "untrusted");
        //todo-sv: implement checks
    });

    it("should correctly list all tags", async () => {
        let mock = await TagLibMock.new();
        mock.addTag(1, "trusted");
        mock.addTag(2, "known");
        mock.addTag(3, "untrusted");

        let res = await mock.toReturnValue();
        console.log(res);
        //todo-sv: implement checks
    });
})