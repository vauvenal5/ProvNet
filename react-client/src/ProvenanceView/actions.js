import { Uri } from "../models";

export const types = {
    uriLoaded: "URI_LOADED",
    createProvPdf: "CREATE_PROV_PDF"
}

export const onURILoaded = (id, uri) => ({
    type: types.uriLoaded,
    uri: new Uri(id, uri)
});

export const onCreateProvPdf = (address, id, uri) => ({
    type: types.createProvPdf,
    address,
    uri: new Uri(id, uri)
})