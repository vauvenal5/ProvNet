import React from 'react';
import Enzyme, { mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import TagsView from "./TagsView";
import Tag from '../models/Tag';

Enzyme.configure({ adapter: new Adapter() });

const setup = (propOverrides) => {
    const props = Object.assign({}, propOverrides);

    const wrapper = shallow(<TagsView {...props}/>);

    return {
        props,
        wrapper,
        render: wrapper.debug()
    }
}

describe("TagsView", () => {
    it("should render empty view", () => {
        const { render } = setup();
        expect(render).toMatchSnapshot();
    });

    it("should render with tags", () => {
        const props = {
            tags: {
                1: new Tag(1, "trusted"),
                2: new Tag(2, "known")
            }
        }
        const {render} = setup(props);
        expect(render).toMatchSnapshot();
    });
});