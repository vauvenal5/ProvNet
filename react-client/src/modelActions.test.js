import * as actions from "./modelActions";
import {ProvContract, Tag, Link} from "./models";

const getExpectedWithAddress = (type, address="testAddress") => ({
    type: type,
    address: address
});

const getExpectedWithContract = (type, contract=new ProvContract("testAddress")) => ({
    type: type,
    contract: contract
});

describe("model actions", () => {
    it("should create a contract load action", () => {
        const expectedAction = getExpectedWithAddress(actions.types.contractLoad);

        expect(actions.onContractLoad(expectedAction.address)).toEqual(expectedAction);
    });
    
    it("should create a contract details loaded action", () => {
        const expected = getExpectedWithAddress(actions.types.contractDetailsLoaded);
        expected.details = {
            title: "title",
            description: "desc",
            logoUrl: "logo"
        };

        expect(actions.onContractDetailsLoaded(
            expected.address, 
            expected.details.title,
            expected.details.description,
            expected.details.logoUrl
        )).toEqual(expected);
    });

    it("should create a contract select action", () => {
        const expected = getExpectedWithAddress(actions.types.contractSelect);

        expect(actions.onContractSelect(expected.address)).toEqual(expected);
    });

    it("should create a type load action", () => {
        const expected = getExpectedWithAddress(actions.types.typeLoad);
        expected.tag = new Tag("testId", "");

        expect(actions.onTypeLoad(expected.address, expected.tag.id)).toEqual(expected);
    });

    it("should create a type loaded action", () => {
        const expected = getExpectedWithAddress(actions.types.typeLoaded);
        expected.tag = new Tag("testTagId", "testTitle");

        expect(actions.onTypeLoaded(expected.address, expected.tag.id, expected.tag.title)).toEqual(expected);
    });

    it("should create a links load action", () => {
        const expected = getExpectedWithAddress(actions.types.linksLoad);

        expect(actions.onLinksLoad(expected.address)).toEqual(expected);
    });

    it("should create a link loaded action", () => {
        const expected = getExpectedWithAddress(actions.types.linkLoaded);
        expected.link = new Link("linkAddress", [1,2], "testTag");

        expect(actions.onLinkLoaded(
            expected.address,
            expected.link.address,
            expected.link.tags,
            expected.link.title
        )).toEqual(expected);
    });
});