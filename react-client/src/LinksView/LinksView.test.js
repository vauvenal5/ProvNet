import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { LinksView, mapStateToProps } from './LinksView';
import testContract from "../models/ProvContract.testHelper";
import ProvContract from '../models/ProvContract';

Enzyme.configure({ adapter: new Adapter() });

const setup = (propOverrides) => {
    const props = Object.assign({contract: testContract}, propOverrides);

    const wrapper = shallow(<LinksView {...props}/>);

    return {
        props,
        wrapper,
        expected: wrapper.debug()
    }
}

describe("LinksView", () => {
    it("should render empty view", () => {
        const {expected} = setup({contract: new ProvContract(undefined)});
        expect(expected).toMatchSnapshot();
    });

    it("should render with links", () => {
        const {expected} = setup();
        expect(expected).toMatchSnapshot();
    });

    it("should map selected contract state to props correctly", () => {
        const state = {
            contracts: {
                selected: [testContract.address],
                [testContract.address]: testContract
            }
        }

        expect(mapStateToProps(state)).toEqual({
            selected: testContract.address,
            contract: testContract
        });
    });

    it("should map selected unselected state to props correctly", () => {
        const state = {
            contracts: {
                selected: [],
                [testContract.address]: testContract
            }
        }

        expect(mapStateToProps(state)).toEqual({
            selected: undefined,
            contract: new ProvContract(undefined)
        });
    });
});