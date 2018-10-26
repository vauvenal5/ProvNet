import {modelActions, EditModalLeaf, ProvContractList, Tag, ProvContract, TagList, accountsPromiseFactory } from "./imports";
import * as actions from "./actions";
import EditModalTagList from "./EditModalTagList";
import { ofType } from "redux-observable";

import SimpleProvenanceContract from "ProvNet/build/linked/SimpleProvenanceContract";
import { from, of, defer } from "rxjs";
import { withLatestFrom, flatMap, map, catchError } from "rxjs/operators";

export const editTagEpic = (action$, state$) => action$.pipe(
    ofType(actions.types.editTag),
    withLatestFrom(state$),
    flatMap(([action, state]) => {
        let web3Instance = new state.web3.eth.Contract(SimpleProvenanceContract.truffle.abi, action.address);
        let contract = ProvContractList.getContract(ProvContractList.getSelf(state), action.address);
        let currentTag = TagList.getTag(ProvContract.getTags(contract), Tag.getId(action.tag));

        return from(
            accountsPromiseFactory(state.web3)
        ).pipe(
            map((accounts) => ({
                web3Instance,
                account: accounts[0],
                action,
                currentTag
            }))
        )
    }),
    flatMap(({web3Instance, account, action, currentTag}) => {
        const detailObsFactory = (detail, currDetail, web3ObsFac) => {
            if(detail.localeCompare(currDetail) == 0) {
                return of({noChange: true});
            }

            return web3ObsFac(detail);
        }

        return defer(() => detailObsFactory(
            Tag.getTitle(action.tag),
            Tag.getTitle(currentTag),
            (title) => web3Instance.methods.setTagTitle(Tag.getId(action.tag), title)
        ))
    })
);

export const reducer = (
    state = new EditModalTagList(), 
    action ) => {
        switch(action.type) {
            case modelActions.types.editTagModalOpen:
                if(action.value) {
                    state = EditModalTagList.putOnce(state, EditModalTagList.create(action.address, new EditModalLeaf(action.tagId)));
                    state = EditModalTagList.setSelected(state, action.address, action.tagId);
                }
                return state.setOpen(action.value);;
            default:
                return state;
        }
}