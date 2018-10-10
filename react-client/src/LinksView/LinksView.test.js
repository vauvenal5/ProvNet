import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { LinksView, mapStateToProps } from './LinksView';
import testContract from "../models/ProvContract.testHelper";
import ProvContract from '../models/ProvContract';
import TagList from '../models/TagList';
import LinkList from '../models/LinkList';
import ProvContractList from '../models/ProvContractList';

Enzyme.configure({ adapter: new Adapter() });

const setup = (propOverrides) => {
    const props = Object.assign({
        tags: testContract.getTags(),
        links: testContract.getLinks().asArray()
    }, propOverrides);

    const wrapper = shallow(<LinksView {...props}/>);

    return {
        props,
        wrapper,
        expected: wrapper.debug()
    }
}

describe("LinksView", () => {
    it("should render empty view", () => {
        const {expected} = setup({
            tags: new TagList(), 
            links: (new LinkList()).asArray()
        });
        expect(expected).toMatchSnapshot();
    });

    it("should render with links", () => {
        const {expected} = setup();
        expect(expected).toMatchSnapshot();
    });

    it("should map selected contract state to props correctly", () => {
        let state = new ProvContractList();
        state = state.assignContract(testContract);
        state = state.setSelected(testContract.getAddress());

        expect(mapStateToProps({contracts: state})).toEqual({
            tags: testContract.getTags(),
            links: testContract.getLinks().asArray()
        });
    });

    it("should map unselected state to props correctly", () => {
        let state = new ProvContractList();
        state = state.assignContract(testContract);
        let empty = new ProvContract();

        expect(mapStateToProps({contracts: state})).toEqual({
            tags: empty.getTags(),
            links: empty.getLinks().asArray()
        });
    });
});