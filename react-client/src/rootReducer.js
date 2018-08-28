import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';
//import TopMenuReducer from './TopMenu/Reducer';
import TopMenu from './TopMenu';
import TagsView from "./TagsView";
import Web3Loader from './Web3Loader';

export const rootEpic = combineEpics(
    Web3Loader.epic,
    TopMenu.epic,
  );

export const rootReducer = combineReducers({
    topMenu: TopMenu.reducer,
    web3Loader: Web3Loader.reducer,
    tagsView: TagsView.reducer,
    web3: Web3Loader.web3,
    selected: TopMenu.selected, //selected is currently a web3js contract and not a model
});