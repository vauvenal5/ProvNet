import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Dimmer, Loader, Header, Icon } from 'semantic-ui-react';

import * as actions from './actions';

// export const Web3Loader = () => {
//     //startLoading();
//     return (
//         <Dimmer active>
//             <Loader size="massive">Loading...</Loader>
//         </Dimmer>
//     );
// }

//todo-sv: https://bit.ly/2QQHXvF This will need addressing soon.

class Web3Loader extends Component {
    componentDidMount() {
        this.props.startWeb3Init();
    }

    render() {
        return (
            <div>
                <Dimmer active={this.props.active}>
                    <Loader size="massive">Loading...</Loader>
                </Dimmer>
                <Dimmer active={this.props.failed}>
                    <Header as='h2' icon inverted>
                        <Icon name='warning sign' />
                        MetaMask plugin not found!
                    </Header>
                </Dimmer>
            </div>
        );
    }
}

// Loader.propTypes = {
//     startLoading: PropTypes.func.isRequired,
// }

const mapStateToProps = (state) => {
    return {
        active: state["web3Loader"].active,
        failed: state["web3Loader"].failed,
    };
}

const mapDispatchToProps = (dispatch) => {
    console.log(actions.startInit());
    return {
        startWeb3Init: () => dispatch(actions.startInit()),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Web3Loader);
