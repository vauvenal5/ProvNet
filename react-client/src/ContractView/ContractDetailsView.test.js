import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import testContract from "../models/ProvContract.testHelper";
import DetailsView from './ContractDetails';

Enzyme.configure({ adapter: new Adapter() });

const setup = (propOverrides) => {
    const props = Object.assign({}, testContract.details, propOverrides);

    const wrapper = shallow(<DetailsView {...props}/>);

    return {
        props,
        wrapper,
        render: wrapper.debug()
    }
};

describe("DetailsView", () => {Component
    it("should render empty URL", () => {
        const { render } = setup({logoUrl: ""});
        expect(render).toMatchSnapshot();
    });
});

describe("DetailsView", () => {
    it("should render with custom URL", () => {
        const { render } = setup();
        expect(render).toMatchSnapshot();
    });
});