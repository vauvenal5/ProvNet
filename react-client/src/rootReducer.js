import * as modelActions from "./modelActions";
import { combineReducers } from 'redux';
import { combineEpics, ofType } from 'redux-observable';
import TopMenu from './TopMenu';
import Web3Loader from './Web3Loader';
import { 
    withLatestFrom, 
    map,  
    flatMap, 
    switchAll, 
    reduce } from "rxjs/operators";
import { of, from, zip} from 'rxjs';

import SimpleProvenanceContract from "ProvNet/build/contracts/SimpleProvenanceContract";

import ProvContract from "./models/ProvContract";
import Tag from "./models/Tag";
import Link from "./models/Link";
import DetailsView from "./DetailsView";

const contractDetailsLoadingEpic = (action$, state$) => action$.pipe(
    ofType(modelActions.types.contractLoad),
    withLatestFrom(state$),
    flatMap(([action, state]) => {
        let contract = new ProvContract(action.address);
        let web3Instance = new state.web3.eth.Contract(SimpleProvenanceContract.abi, action.address);
        return zip(
            web3Instance.methods.getDescription().call(),
            web3Instance.methods.getLogoUrl().call(),
            (description, logoUrl) => {
                contract.details.description = description;
                contract.details.logoUrl = logoUrl;
                return contract;
            }
        );
    }),
    flatMap(contract => of(
        modelActions.onContractDetailsLoaded(contract),
    )),
);

const contractTypesLoadEpic = (action$, state$) => action$.pipe(
    ofType(modelActions.types.contractLoad),
    withLatestFrom(state$),
    flatMap(([action, state]) => {
        let web3Instance = new state.web3.eth.Contract(SimpleProvenanceContract.abi, action.address);
        return from(
            web3Instance.methods.getLinkTypes().call()
        ).pipe(
            switchAll(),
            map(type => modelActions.onTypeLoad(action.address, type)),
            reduce((actions, action) => {
                actions.push(action);
                return actions;
            }, []),
            map(actions => {
                actions.push(modelActions.onLinksLoad(action.address));
                return actions;
            }),
            switchAll()
        );
    }),
);

const typeLoadEpic = (action$, state$) => action$.pipe(
    ofType(modelActions.types.typeLoad),
    withLatestFrom(state$),
    flatMap(([action, state]) => {
        let web3Instance = new state.web3.eth.Contract(SimpleProvenanceContract.abi, action.address);
        return from(
            web3Instance.methods.getLinkType(action.tag.id).call()
        ).pipe(
            map(typeName => {
                return modelActions.onTypeLoaded(action.address, new Tag(action.tag.id, typeName, true));
            })
        );
    }),
);

const contractLinksLoadEpic = (action$, state$) => action$.pipe(
    ofType(modelActions.types.linksLoad),
    withLatestFrom(state$),
    map(([action, state]) => ({action: action, web3Instance: new state.web3.eth.Contract(SimpleProvenanceContract.abi, action.address)})
    ),
    flatMap(({action, web3Instance}) => from(
            web3Instance.methods.getLinkList().call()
        ).pipe(
            switchAll(),
            withLatestFrom(state$),
            flatMap(([linkAddress, state]) => zip(
                web3Instance.methods.getLink(linkAddress).call(),
                (new state.web3.eth.Contract(SimpleProvenanceContract.abi, linkAddress)).methods.getTitle().call(),
                (res, title) => modelActions.onLinkLoaded(action.address, new Link(res[0], res[1].filter(tag => tag != 0), title))
            ))
        )
    ),
);

export const rootEpic = combineEpics(
    Web3Loader.epic,
    TopMenu.epic,
    contractTypesLoadEpic,
    contractLinksLoadEpic,
    typeLoadEpic,
    contractDetailsLoadingEpic,
);


export const contractReducer = (state = {selected: []}, action) => {
    console.log(action.type);
    //console.log(state);
    let contract;
    switch(action.type) {
        case modelActions.types.contractLoad:
            return {
                ...state,
                [action.address]: new ProvContract(action.address)
            };
        case modelActions.types.contractDetailsLoaded:
            contract = state[action.contract.address];
            return {
                ...state,
                [action.contract.address]: {
                    ...contract,
                    details: action.contract.details
                }
            };
        case modelActions.types.typeLoad:
        case modelActions.types.typeLoaded:
            contract = state[action.address];
            return {
                ...state,
                [action.address]: {
                    ...contract,
                    types: {
                        ...contract.types,
                        [action.tag.id]: action.tag
                    }
                }
            };
        // case modelActions.types.contractTypeLoaded:
        //     contract = state[action.address];
        //     let tag = contract.types[action.tag.id];
        //     return {
        //         ...state,
        //         [action.address]: {
        //             ...contract,
        //             //types: [...contract.types, action.tag]
        //             types: {
        //                 ...contract.types,
        //                 [action.tag.id]: {
        //                     ...tag,
        //                     title: action.tag.title
        //                 }
        //             }
        //         }
        //     };
        case modelActions.types.linkLoaded:
            contract = state[action.contractAddress];
            return {
                ...state,
                [action.contractAddress]: {
                    ...contract,
                    links: [...contract.links, action.link]
                }
            };
        case modelActions.types.contractSelect:
            return {
                ...state,
                selected: [action.address]
            }
        default:
            return state;
    }
}

export const rootReducer = combineReducers({
    contracts: contractReducer,
    topMenu: TopMenu.reducer,
    web3Loader: Web3Loader.reducer,
    detailsView: DetailsView.reducer,
    web3: Web3Loader.web3,
});