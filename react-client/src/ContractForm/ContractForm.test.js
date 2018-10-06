import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import testContract from "../models/ProvContract.testHelper";
import ContractForm from '.';

Enzyme.configure({ adapter: new Adapter() });

const setup = (propOverrides) => {
    const props = Object.assign({}, testContract.details, propOverrides);

    const wrapper = shallow(<ContractForm.Component {...props}/>);

    return {
        props,
        wrapper,
        render: wrapper.debug()
    }
};

describe("ContractForm", () => {
    it("should render empty URL", () => {
        const { render } = setup({logoUrl: ""});
        expect(render).toMatchSnapshot();
    });
});

describe("ContractForm", () => {
    it("should render with custom URL", () => {
        const { render } = setup();
        expect(render).toMatchSnapshot();
    });
});