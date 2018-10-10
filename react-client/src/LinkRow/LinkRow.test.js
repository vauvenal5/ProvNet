import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import LinkRow from '.';
import testContract from "../models/ProvContract.testHelper";

Enzyme.configure({ adapter: new Adapter() });

const setup = (propOverrides) => {
    const props = Object.assign({
        types: testContract.getTags(),
        link: testContract.getLinks().getLinkAt(0)
    }, propOverrides);

    const wrapper = shallow(<LinkRow {...props}/>);

    return {
        props,
        wrapper,
        render: wrapper.debug()
    }
};

describe("LinkRow", () => {
    it("should render", () => {
        const { render } = setup();
        expect(render).toMatchSnapshot();
    });
});