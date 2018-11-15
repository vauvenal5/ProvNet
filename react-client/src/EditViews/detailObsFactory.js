import { of } from "rxjs";

export const detailObsFactory = (detail, currDetail, web3ObsFac) => {
    if(detail.localeCompare(currDetail) == 0) {
        return of({noChange: true});
    }

    return web3ObsFac();
};