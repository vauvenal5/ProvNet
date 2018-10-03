import * as actions from "./modelActions";
import {types} from "./modelActions";
import ProvContract from "./models/ProvContract";
import Tag from "./models/Tag";
import Link from "./models/Link";

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
        const expectedAction = getExpectedWithAddress(types.contractLoad);

        expect(actions.onContractLoad(expectedAction.address)).toEqual(expectedAction);
    });
    
    it("should create a contract details loaded action", () => {
        const expected = getExpectedWithAddress(types.contractDetailsLoaded);
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
        const expected = getExpectedWithAddress(types.contractSelect);

        expect(actions.onContractSelect(expected.address)).toEqual(expected);
    });

    it("should create a type load action", () => {
        const expected = getExpectedWithAddress(types.typeLoad);
        expected.tag = new Tag("testId", "");

        expect(actions.onTypeLoad(expected.address, expected.tag.id)).toEqual(expected);
    });

    it("should create a type loaded action", () => {
        const expected = getExpectedWithAddress(types.typeLoaded);
        expected.tag = new Tag("testTagId", "testTitle");

        expect(actions.onTypeLoaded(expected.address, expected.tag.id, expected.tag.title)).toEqual(expected);
    });

    it("should create a links load action", () => {
        const expected = getExpectedWithAddress(types.linksLoad);

        expect(actions.onLinksLoad(expected.address)).toEqual(expected);
    });

    it("should create a link loaded action", () => {
        const expected = getExpectedWithAddress(types.linkLoaded);
        expected.link = new Link("linkAddress", [1,2], "testTag");

        expect(actions.onLinkLoaded(
            expected.address,
            expected.link.address,
            expected.link.tags,
            expected.link.title
        )).toEqual(expected);
    });
});