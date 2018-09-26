import * as modelActions from "./modelActions";
import { combineReducers } from 'redux';
import { combineEpics, ofType } from 'redux-observable';
//import TopMenuReducer from './TopMenu/Reducer';
import TopMenu from './TopMenu';
import TagsView from "./TagsView";
import Web3Loader from './Web3Loader';
import { withLatestFrom, map, mergeMap, flatMap, switchAll, repeat } from "rxjs/operators";
import { Observable, of, from, concat, zip} from 'rxjs';
// import { of } from 'rxjs/observable/of';
// import { concat } from 'rxjs/observable/concat';

import SimpleProvenanceContract from "ProvNet/build/contracts/SimpleProvenanceContract";

import ProvContract from "./models/ProvContract";
import Tag from "./models/Tag";
import Link from "./models/Link";
import DetailsView from "./DetailsView";

const contractLoadEpic = (action$, state$) => action$.pipe(
    ofType(modelActions.types.contractLoad),
    withLatestFrom(state$),
    map(([action, state]) => new ProvContract(
        action.address, 
        new state.web3.eth.Contract(SimpleProvenanceContract.abi, action.address)
    )),
    flatMap((contract) => zip(
        contract.web3Instance.methods.getDescription().call(),
        contract.web3Instance.methods.getLogoUrl().call(),
        (description, logoUrl) => {
            contract.description = description;
            contract.logoUrl = logoUrl;
            return contract;
        }
    )),
    flatMap(contract => of(
        modelActions.onContractLoadSuccess(contract),
        modelActions.onTypesLoad(contract),
        modelActions.onContractLinksLoad(contract),
    )),
);

const contractTypesLoadEpic = (action$) => action$.pipe(
    ofType(modelActions.types.contractTypesLoad),
    flatMap(action => from(
            action.contract.web3Instance.methods.getLinkTypes().call()
        ).pipe(
            switchAll(),
            flatMap(type => from(
                action.contract.web3Instance.methods.getLinkType(type).call()
            ).pipe(
                map(typeName => {
                    return modelActions.onContractTypeLoaded(action.contract.address, new Tag(type, typeName));
                })
            ))
        )
    ),
);

const contractLinksLoadEpic = (action$) => action$.pipe(
    ofType(modelActions.types.contractLinksLoad),
    flatMap(action => from(
        action.contract.web3Instance.methods.getLinkList().call()
    ).pipe(
        switchAll(),
        flatMap(linkAddress => from(
            action.contract.web3Instance.methods.getLink(linkAddress).call()
        ).pipe(
            map((res) => {
                return modelActions.onContractLinkLoaded(action.contract.address, new Link(res[0], res[1].filter(tag => tag != 0)));
            })
        ))
    )),
);

export const rootEpic = combineEpics(
    Web3Loader.epic,
    TopMenu.epic,
    contractLoadEpic,
    contractTypesLoadEpic,
    contractLinksLoadEpic,
);


export const contractReducer = (state = {}, action) => {
    let contract;
    switch(action.type) {
        case modelActions.types.contractLoadSuccess:
            return Object.assign({}, state, {
                [action.contract.address]: action.contract
            });
        case modelActions.types.contractTypeLoaded:
            contract = state[action.address];
            return {
                ...state,
                [action.address]: {
                    ...contract,
                    //types: [...contract.types, action.tag]
                    types: {
                        ...contract.types,
                        [action.tag.id]: action.tag
                    }
                }
            };
        case modelActions.types.contractLinkLoaded:
            contract = state[action.contractAddress];
            return {
                ...state,
                [action.contractAddress]: {
                    ...contract,
                    links: [...contract.links, action.link]
                }
            };
        // case modelActions.types.contractSelect:
        //     return Object.assign({}, state, {
        //         selected: action.address
        //     });
        default:
            return state;
    }
}

export const rootReducer = combineReducers({
    contracts: contractReducer,
    topMenu: TopMenu.reducer,
    web3Loader: Web3Loader.reducer,
    detailsView: DetailsView.reducer,
    //tagsView: TagsView.reducer,
    web3: Web3Loader.web3,
    //selected: TopMenu.selected, //selected is currently a web3js contract and not a model
});