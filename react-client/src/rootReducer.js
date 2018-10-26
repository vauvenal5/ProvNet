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
    reduce,
    catchError } from "rxjs/operators";
import { of, from, zip, forkJoin} from 'rxjs';

import SimpleProvenanceContract from "ProvNet/build/linked/SimpleProvenanceContract";

import ProvContract from "./models/ProvContract";
import Tag from "./models/Tag";
import Link from "./models/Link";
import DetailsView from "./DetailsView";
import ProvContractList from "./models/ProvContractList";
import TagList from "./models/TagList";
import LinkList from "./models/LinkList";
import Select from "./SelectReducer";
import {DeployContract} from "./EditViews";
import {EditDetailsView, editTagReducer} from "./EditViews";

//import contract from "truffle-contract";

export const contractDetailsLoadingEpic = (action$, state$) => action$.pipe(
    ofType(modelActions.types.contractLoad),
    withLatestFrom(state$),
    flatMap(([action, state]) => {
        let web3Instance = new state.web3.eth.Contract(SimpleProvenanceContract.truffle.abi, action.address);
        return forkJoin(
            web3Instance.methods.getDescription().call(),
            web3Instance.methods.getLogoUrl().call(),
            web3Instance.methods.getTitle().call(),
        ).pipe(
            map(([description, logoUrl, title]) => modelActions.onContractDetailsLoaded(action.address, title, description, logoUrl))
        );
    }),
);

export const contractTypesLoadEpic = (action$, state$) => action$.pipe(
    ofType(modelActions.types.contractLoad),
    withLatestFrom(state$),
    flatMap(([action, state]) => {
        let web3Instance = new state.web3.eth.Contract(SimpleProvenanceContract.truffle.abi, action.address);
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

export const typeLoadEpic = (action$, state$) => action$.pipe(
    ofType(modelActions.types.typeLoad),
    withLatestFrom(state$),
    flatMap(([action, state]) => {
        let web3Instance = new state.web3.eth.Contract(SimpleProvenanceContract.truffle.abi, action.address);
        return from(
            web3Instance.methods.getLinkType(action.tag.id).call()
        ).pipe(
            map(typeName => {
                return modelActions.onTypeLoaded(action.address, action.tag.id, typeName);
            })
        );
    }),
);

export const contractLinksLoadEpic = (action$, state$) => action$.pipe(
    ofType(modelActions.types.linksLoad),
    withLatestFrom(state$),
    map(([action, state]) => ({action: action, web3Instance: new state.web3.eth.Contract(SimpleProvenanceContract.truffle.abi, action.address)})
    ),
    flatMap(({action, web3Instance}) => from(
            web3Instance.methods.getLinkList().call()
        ).pipe(
            switchAll(),
            withLatestFrom(state$),
            flatMap(([linkAddress, state]) => zip(
                web3Instance.methods.getLink(linkAddress).call(),
                (new state.web3.eth.Contract(SimpleProvenanceContract.truffle.abi, linkAddress)).methods.getTitle().call(),
                (res, title) => modelActions.onLinkLoaded(action.address, res[0], res[1].filter(tag => tag != 0), title)
            ))
        )
    ),
);

export const linkSelectEpic = (action$, state$) => action$.pipe(
    ofType(modelActions.types.linkSelect),
    withLatestFrom(state$),
    flatMap(([action, state]) => {
        if(state.contracts.isLoaded(action.address)){
            return of(modelActions.onLinkSelected(action.address));
        }

        return of(
            modelActions.onContractLoad(action.address),
            modelActions.onLinkSelected(action.address)
        );
    })
);

export const deployContractEpic = (action$, state$) => action$.pipe(
    ofType(modelActions.types.deployContract),
    withLatestFrom(state$),
    flatMap(([action, state]) => {
        const promiseCallback = (resolve, reject) => (err, id) => {
            if(err) {
                reject(err);
            }
            resolve(id);
        };

        let networkIdPromise = new Promise((resolve, reject) => {
            state.web3.eth.net.getId(promiseCallback(resolve, reject))
        });

        let accountsPromise = new Promise((resolve, reject) => {
            state.web3.eth.getAccounts(promiseCallback(resolve, reject))
        });

        return zip(
            networkIdPromise, 
            accountsPromise, 
            (id, accounts) => ({
                account: accounts[0],
                web3Instance: new state.web3.eth.Contract(
                    SimpleProvenanceContract.truffle.abi, 
                    undefined, 
                    //todo-sv: add some check if binary exists for this network
                    {data: SimpleProvenanceContract.binary[id]}
                )
            })
        );
    }),
    flatMap(({account, web3Instance}) => {
        return from(
            web3Instance.deploy().send({from: account})
        ).pipe(
            map(res => {console.log(res); return modelActions.onDeployedContract(res.options.address);}),
            catchError(err => {
                console.log(err);
                return of(modelActions.onDeployContractFailed(err));
            })
        )
    }),  
);

export const contractReducer = (state = new ProvContractList(), action) => {
    console.log(action.type);
    console.log(state);
    let contract;
    switch(action.type) {
        case modelActions.types.contractLoad:
            return state.assignContract(new ProvContract(action.address));
        case modelActions.types.contractDetailsLoaded:
            return state.assignContract(
                state.getContract(action.address).setDetails(action.details)
            );
        case modelActions.types.typeLoad:
        case modelActions.types.typeLoaded:
            contract = state.getContract(action.address);
            return state.assignContract(
                contract.setTags(contract.getTags().addTag(action.tag))
            );
        //TODO-sv: clean up?
        // case modelActions.types.linksLoad:
        //     contract = state[action.address];
        //     return {
        //         ...state,
        //         [action.address]: {
        //             ...contract,
                    
        //         }
        //     }
        case modelActions.types.linkLoaded:
            contract = state.getContract(action.address);
            return state.assignContract(
                contract.setLinks(contract.getLinks().addLink(action.link))
            );
        //todo-sv: this should probably move to the selectReducer now that it exists
        case modelActions.types.contractSelected:
            return state.setSelected(action.address);
        case modelActions.types.linkSelected:
            return state.setLinkSelected(action.address);
        default:
            return state;
    }
}

export const rootEpic = combineEpics(
    Web3Loader.epic,
    contractTypesLoadEpic,
    contractLinksLoadEpic,
    typeLoadEpic,
    contractDetailsLoadingEpic,
    linkSelectEpic,
    Select.epic,
    deployContractEpic,
    EditDetailsView.epic,
);

export const rootReducer = combineReducers({
    contracts: contractReducer,
    web3Loader: Web3Loader.reducer,
    detailsView: DetailsView.reducer,
    web3: Web3Loader.web3,
    select: Select.reducer,
    deployment: DeployContract.reducer,
    editDetails: EditDetailsView.reducer,
    editTag: editTagReducer,
});