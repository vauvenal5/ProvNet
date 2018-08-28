import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Form, Label, Input, Image } from 'semantic-ui-react';

//import * as actions from './actions';

//component part
export const ContractForm = (props) => {
    return (
        <Image src='https://react.semantic-ui.com/images/wireframe/media-paragraph.png' />
    );
}

//container part
const mapStateToProps = (state) => {
    return {
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ContractForm);