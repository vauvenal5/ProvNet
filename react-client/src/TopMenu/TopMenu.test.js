import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { mapDispatchToProps, TopMenu, mapStateToProps } from './TopMenu';
import * as actions from '../modelActions';
import testContract from "../models/ProvContract.testHelper";
import { Form, Icon } from 'semantic-ui-react';

Enzyme.configure({ adapter: new Adapter() });

const setup = (propOverrides) => {
    const props = Object.assign({
        deploy: {
            loading: false,
            success: false,
            error: false
        }
    }, propOverrides);

    const wrapper = shallow(<TopMenu {...props}/>);

    return {
        props,
        wrapper,
        expected: wrapper.debug()
    }
}

describe("TopMenu", () => {
    it("should render empty view", () => {
        const {expected} = setup();
        expect(expected).toMatchSnapshot();
    });

    it("should call correct dispatch on item click", (done) => {
        const dispatch = (action) => {
            expect(action).toEqual(actions.onContractSelect(testContract.address));
            done();
        };
        mapDispatchToProps(dispatch).searchSubmit(testContract.address);
    });

    it("should submit search with correct address", (done) => {
        const { wrapper } = setup({searchSubmit: (address) => {
            expect(address).toEqual(testContract.address);
            done();
        }})

        wrapper.find(Form.Input).prop("onChange")("event", { 
            name: "address",
            value: testContract.address
        });

        wrapper.find(Form).simulate("submit");
    });
});Icon