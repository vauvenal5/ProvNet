import { TestScheduler } from 'rxjs/testing';
import Web3 from 'web3';
import * as modelActions from "./modelActions";
import { 
    contractReducer,
    contractDetailsLoadingEpic, 
    contractTypesLoadEpic,
    typeLoadEpic,
    contractLinksLoadEpic } from "./rootReducer";
import ProvContract from './models/ProvContract';
import Tag from './models/Tag';
import Link from './models/Link';
import { fail } from 'assert';
jest.mock('web3');

const getScheduler = () => {
    return new TestScheduler((actual, expected) => {
        expect(actual).toEqual(expected);
    });
};

const getState$ = (cold, createMethods) => {
    return cold("a", {
        a: {
            web3: {
                eth: {
                    Contract: jest.fn((abi, address) => ({
                            methods: createMethods(abi, address)
                    }))
                }
            }
        }
    });
}

const getCall = (cold, order, value$) => ({call: () => cold(order, value$)});

describe("Contract Epics", () => {
    it('should correctly load contract details', () => {
        const scheduler = getScheduler();
        scheduler.run(({hot, cold, expectObservable}) => {
            let expectedContract = new ProvContract("testAddress");
            expectedContract.details.title = "testTitle";
            expectedContract.details.description = "testDescription";
            expectedContract.details.logoUrl = "testUrl";

            const createMethods = (abi, address) => {
                let methods = {};
                methods.getDescription = () => getCall(cold, "--a|", {
                    a: expectedContract.details.description
                });

                methods.getLogoUrl = () => getCall(cold, "---a|", {
                    a: expectedContract.details.logoUrl
                });

                methods.getTitle = () => getCall(cold, "-a|", {
                    a: expectedContract.details.title
                });
                return methods;
            };

            const action$ = hot('-a', {
                a: { type: modelActions.types.contractLoad, address: expectedContract.address }
            });

            const output$ = contractDetailsLoadingEpic(action$, getState$(cold, createMethods));

            expectObservable(output$).toBe('-----a', {
                a: {
                    type: modelActions.types.contractDetailsLoaded,
                    address: expectedContract.address,
                    details: expectedContract.details
                }
            });
        });
    });

    it("should correctly trigger types loading", () => {
        const scheduler = getScheduler();
        scheduler.run(({hot, cold, expectObservable}) => {
            let expectedContract = new ProvContract("testAddress");
            let expectedTypes = [1, 2];

            const createMethods = () => {
                let methods = {};
                methods.getLinkTypes = () => getCall(cold, "--a|", {
                    a: expectedTypes
                });
                return methods;
            };

            const action$ = hot('-a', {
                a: modelActions.onContractLoad(expectedContract.address)
            });

            const output$ = contractTypesLoadEpic(action$, getState$(cold, createMethods));

            expectObservable(output$).toBe("----(abc)", {
                a: modelActions.onTypeLoad(expectedContract.address, 1),
                b: modelActions.onTypeLoad(expectedContract.address, 2),
                c: modelActions.onLinksLoad(expectedContract.address)
            });
        });
    });

    it("should correctly load a type", () => {
        const scheduler = getScheduler();
        scheduler.run(({hot, cold, expectObservable}) => {
            let expectedContract = new ProvContract("testAddress");
            let expectedTag = new Tag(1, "trusted");

            const createMethods = (abi, address) => {
                let methods = {};
                methods.getLinkType = (id) => getCall(cold, "-a|", {
                    a: expectedTag.title
                });
                return methods;
            }

            let contract = {methods: {}};
            contract.methods.getLinkType = (id) => getCall(cold, "-a|", {
                a: expectedTag.title
            });

            const action$ = hot('-a', {
                a: modelActions.onTypeLoad(expectedContract.address, expectedTag.id)
            });

            const output$ = typeLoadEpic(action$, getState$(cold, createMethods));

            expectObservable(output$).toBe("--a", {
                a: modelActions.onTypeLoaded(expectedContract.address, expectedTag.id, expectedTag.title)
            });
        });
    });

    it("should correctly load links", () => {
        const scheduler = getScheduler();
        scheduler.run(({hot, cold, expectObservable}) => {
            let expectedContract = new ProvContract("testAddress");
            let linkAddresses = ["tuwienAdd", "infosysAdd", "dsgAdd"];
            let contractTitles = {
                [linkAddresses[0]]: "TUWien", 
                [linkAddresses[1]]: "InfoSys", 
                [linkAddresses[2]]: "DSG"
            };
            let tags = {
                [linkAddresses[0]]: [1, 0, 0], 
                [linkAddresses[1]]: [0, 2, 0], 
                [linkAddresses[2]]: [1, 2, 3]
            };
            let tagsFiltered = {
                [linkAddresses[0]]: [1], 
                [linkAddresses[1]]: [2], 
                [linkAddresses[2]]: [1, 2, 3]
            };

            const creatMethods = (abi, address) => {
                let methods = {};
                methods.getLinkList = () => getCall(cold, "-a|", {
                    a: linkAddresses
                });
                methods.getLink = (linkAddress) => getCall(cold, "-a|", {
                    a: [linkAddress, tags[linkAddress]]
                });
                methods.getTitle = () => getCall(cold, "-a|", {
                    a: contractTitles[address]
                });
                return methods;
            };

            const action$ = hot('-a', {
                a: modelActions.onLinksLoad(expectedContract.address)
            });

            const output$ = contractLinksLoadEpic(action$, getState$(cold, creatMethods));

            const getExpectedLink = (address, index) => {
                return modelActions.onLinkLoaded(address, linkAddresses[index], tagsFiltered[linkAddresses[index]], contractTitles[linkAddresses[index]]);
            }

            expectObservable(output$).toBe("---(abc)", {
                a: getExpectedLink(expectedContract.address, 0),
                b: getExpectedLink(expectedContract.address, 1),
                c: getExpectedLink(expectedContract.address, 2),
            });
        });
    });
});

describe("Contract reducer", () => {
    it("should return the initial state", () => {
        expect(contractReducer(undefined, {}))
        .toEqual({
            selected: []
        })
    });

    it("should correctly handle contract load action", () => {
        expect(contractReducer({}, modelActions.onContractLoad("testAddress")))
        .toEqual({
            testAddress: new ProvContract("testAddress")
        })
    });

    it("should correctly handle contract details loaded action", () => {
        expect(contractReducer({
            testAddress: new ProvContract("testAddress")
        }, modelActions.onContractDetailsLoaded("testAddress", "title", "desc", "logo")))
        .toEqual({
            testAddress: {
                address: "testAddress",
                details: {
                    title: "title",
                    description: "desc",
                    logoUrl: "logo"
                },
                links: [],
                types: {}
            }
        });
    });

    it("should correctly handle type load action", () => {
        expect(contractReducer({
            testAddress: {
                types: {}
            }
        }, modelActions.onTypeLoad("testAddress", 1)))
        .toEqual({
            testAddress: {
                types: {
                    1: {
                        id: 1,
                        title: ""
                    }
                }
            }
        });
    });

    it("should correctly handle type loaded action", () => {
        expect(contractReducer({
            testAddress: {
                types: {}
            }
        }, modelActions.onTypeLoaded("testAddress", 1, "tag")))
        .toEqual({
            testAddress: {
                types: {
                    1: {
                        id: 1,
                        title: "tag"
                    }
                }
            }
        });
    });

    it("should correctly handle link loaded action", () => {
        expect(contractReducer({
            testAddress: {
                links: []
            }
        }, modelActions.onLinkLoaded("testAddress", "linkAddress", [1], "link")))
        .toEqual({
            testAddress: {
                links: [{
                    address: "linkAddress",
                    tags: [1],
                    title: "link"
                }]
            }
        });
    });

    it("should correctly handle contract select action", () => {
        expect(contractReducer({
            selected: []
        }, modelActions.onContractSelect("testAddress")))
        .toEqual({
            selected: ["testAddress"]
        });
    });
});