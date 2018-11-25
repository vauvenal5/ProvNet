import * as modelActions from "./modelActions";
import { combineReducers } from 'redux';
import { combineEpics, ofType } from 'redux-observable';
import Web3Loader from './Web3Loader';
import { 
    withLatestFrom, 
    map,  
    flatMap, 
    switchAll,
    reduce,
    catchError } from "rxjs/operators";
import { of, from, zip, forkJoin, Observable} from 'rxjs';

import SimpleProvenanceContract from "ProvNet/build/linked/SimpleProvenanceContract";

import { ProvContract, TagSelector, SelectSelector, SpecialRoleSelector, UserSelector, ProvContractMap, ProvContractSelector, UriSelector } from "./models";
import Select from "./SelectReducer";
import {DeployContract} from "./EditViews";
import {EditDetailsView, editTagReducer, editTagEpic} from "./EditViews";
import {reducer as specialRolesReducer} from "./UsersView";
import {withWeb3ContractFrom} from "./operators";
import {tagReducer} from "./tagReducer";
import { linkReducer } from "./linksReducer";
import { EditModelReducer, editModelEpics } from "./EditViews";
import EditModelSelector from "./models/selectors/EditModelSelector";
import {epic as userEpic} from "./EditViews/EditUserView";
import {reducer as uriReducer, epic as uriEpic} from "./ProvenanceView";

export const contractDetailsLoadingEpic = (action$, state$) => action$.pipe(
    ofType(modelActions.types.contractLoad),
    withWeb3ContractFrom(state$),
    flatMap(({action, web3Instance}) => {
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
    withWeb3ContractFrom(state$),
    flatMap(({action, web3Instance}) => {
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
        if(ProvContractSelector.isLoaded(state, action.address)){
            return of(modelActions.onLinkSelected(action.address));
        }

        return of(
            modelActions.onContractLoad(action.address),
            modelActions.onLinkSelected(action.address)
        );
    })
);

export const contractReducer = (state = new ProvContractMap(ProvContractSelector.key), action) => {
    console.log(action.type);

    switch(action.type) {
        case modelActions.types.contractLoad:
            return ProvContractMap.add(state, new ProvContract(action.address));
        case modelActions.types.contractDetailsLoaded:
            return ProvContractMap.add(state, new ProvContract(action.address, action.details));
        
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
    editModelEpics,
    specialRolesReducer.epic,
    userEpic,
    uriEpic
);

export const rootReducer = combineReducers({
    [ProvContractSelector.key]: contractReducer,
    web3Loader: Web3Loader.reducer,
    web3: Web3Loader.web3,
    [SelectSelector.getKey()]: Select.reducer,
    [EditModelSelector.key]: EditModelReducer,
    [SpecialRoleSelector.key]: specialRolesReducer.specialRolesReducer,
    [UserSelector.key]: specialRolesReducer.usersReducer,
    [TagSelector.key]: tagReducer,
    links: linkReducer,
    [UriSelector.key]: uriReducer,
});
