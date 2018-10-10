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
import ProvContractList from './models/ProvContractList';
import ContractDetails from './models/ContractDetails';
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

const setupContractReducerState = () => {
    const contract = new ProvContract("testAddress");
    const initState = new ProvContractList().assignContract(contract);
    return {initState, contract};
};

describe("Contract reducer", () => {
    it("should return the initial state", () => {
        expect(contractReducer(undefined, {}))
        .toEqual({
            selected: []
        })
    });

    it("should correctly handle contract load action", () => {
        expect(contractReducer(undefined, modelActions.onContractLoad("testAddress")))
        .toEqual(new ProvContractList()
            .assignContract(new ProvContract("testAddress"))
        )
    });

    it("should correctly handle contract details loaded action", () => {
        let {initState, contract} = setupContractReducerState();
        let details = new ContractDetails("title", "desc", "logo");
        let expectedContract = contract.setDetails(details);
        let expectedState = initState.assignContract(expectedContract);
            
        expect(contractReducer(initState,            
            modelActions.onContractDetailsLoaded(
                contract.getAddress(),
                details.getTitle(),
                details.getDescription(),
                details.getLogoUrl()
            )
        ))
        .toEqual(expectedState);
    });

    it("should correctly handle type load action", () => {
        let {initState, contract} = setupContractReducerState();
        let tag = new Tag(1, "");
        let expected = initState.assignContract(
            contract.setTags(contract.getTags().addTag(tag))
        );

        expect(contractReducer(initState, 
            modelActions.onTypeLoad(contract.getAddress(), tag.getId())
        ))
        .toEqual(expected);
    });

    it("should correctly handle type loaded action", () => {
        let {initState, contract} = setupContractReducerState();
        let tag = new Tag(1, "tag");
        let expected = initState.assignContract(
            contract.setTags(contract.getTags().addTag(tag))
        );

        expect(contractReducer(initState, 
            modelActions.onTypeLoaded(contract.getAddress(), tag.getId(), tag.getTitle())
        ))
        .toEqual(expected);
    });

    it("should correctly handle link loaded action", () => {
        let {initState, contract} = setupContractReducerState();
        let link = new Link("linkAddress", [1], "link");
        let expected = initState.assignContract(
            contract.setLinks(contract.getLinks().addLink(link))
        );

        expect(contractReducer(initState, 
            modelActions.onLinkLoaded(
                contract.getAddress(), 
                link.getAddress(), 
                link.getTags(), 
                link.getTitle()
            )
        ))
        .toEqual(expected);
    });

    it("should correctly handle contract select action", () => {
        expect(contractReducer(undefined, modelActions.onContractSelect("testAddress")))
        .toEqual({
            selected: ["testAddress"]
        });
    });
});