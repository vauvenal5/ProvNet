import React from 'react';
import Enzyme, { mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import LinkRow from '.';
import Link from '../models/Link';
import Tag from '../models/Tag';

Enzyme.configure({ adapter: new Adapter() });

const setup = (propOverrides) => {
    const props = Object.assign({
        types: {
            ["1"]: new Tag(1, "trusted"),
            ["2"]: new Tag(2, "known")
        },
        link: new Link("linkAddress", [1,2], "tagTitle")
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