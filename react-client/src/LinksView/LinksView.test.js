import React from 'react';
import Enzyme, { mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { LinksView } from './LinksView';
import ProvContract from '../models/ProvContract';
import Link from '../models/Link';
import Tag from '../models/Tag';
import renderer from 'react-test-renderer';

Enzyme.configure({ adapter: new Adapter() });

const setup = (propOverrides) => {
    const props = Object.assign({
        contract: new ProvContract("testAddress")
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
        const {expected} = setup();
        expect(expected).toMatchSnapshot();
    });

    it("should render with links", () => {
        let contract = new ProvContract("testAddress");
        contract.types["1"] = new Tag(1, "trusted");
        contract.types["2"] = new Tag(1, "known");
        contract.links.push(new Link("link1", [1], "title1"));
        contract.links.push(new Link("link2", [1,2], "title2"));
        const {expected} = setup({
            contract: contract
        });
        expect(expected).toMatchSnapshot();
    });
});