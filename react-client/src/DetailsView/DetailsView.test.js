import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { DetailsView, mapStateToProps } from './DetailsView';
import testContract from "../models/ProvContract.testHelper";
import ProvContract from '../models/ProvContract';

Enzyme.configure({ adapter: new Adapter() });

const setup = (propOverrides) => {
    const props = Object.assign({
        selected: testContract.address,
        contract: testContract
    }, propOverrides);

    const wrapper = shallow(<DetailsView {...props}/>);

    return {
        props,
        wrapper,
        render: wrapper.debug()
    }
};

describe("DetailsView", () => {
    it("should render", () => {
        const { render } = setup();
        expect(render).toMatchSnapshot();
    });

    it("should map state to props correctly", () => {
        const {props} = setup();
        expect(mapStateToProps({
            contracts: {
                selected: [testContract.address],
                [testContract.address]: testContract
            }
        })).toEqual(props);
    });

    it("should map empty state to props correctly", () => {
        expect(mapStateToProps({
            contracts: {
                selected: [],
            }
        })).toEqual({
            selected: undefined,
            contract: new ProvContract(undefined)
        });
    });
});