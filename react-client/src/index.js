import React from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {rootReducer, rootEpic} from "./rootReducer";
import { createEpicMiddleware } from 'redux-observable';
import { Route, Switch } from 'react-router-dom'
import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { ConnectedRouter } from 'connected-react-router'

const epicMiddleware = createEpicMiddleware();

const history = createBrowserHistory();

const store = createStore(
    rootReducer(history), 
    applyMiddleware(
        routerMiddleware(history),
        epicMiddleware
    )
);

epicMiddleware.run(rootEpic);

ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <Switch>
                <Route path="/contracts/:contract" component={App}/>
                <Route path="/" component={App}/>
            </Switch>
        </ConnectedRouter>
        {/* <App /> */}
    </Provider>, 
    document.getElementById('root')
);
registerServiceWorker();

// export const types = {
//     initWeb3: "INIT_WEB3",
//     initWeb3Success: "INIT_WEB3_SUCCESS",
//     initWeb3Failed: "INIT_WEB3_FAILED",
// }

// export const startInit = (web3) => ({
//     type: types.initWeb3,
//     web3: web3,
// })

// console.log(window.web3);
// let start = new Web3(window.web3.currentProvider);
// store.dispatch({
//     type: types.initWeb3,
//     web3: start,
// });