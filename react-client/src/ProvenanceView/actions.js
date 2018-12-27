import { Uri, ProvRecords } from "../models";

export const types = {
    uriLoaded: "URI_LOADED",
    provRecordsLoaded: "PROV_RECORDS_LOADED",
    showProvRecords: "SHOW_PROV_RECORDS",
    loadProvRecords: "LOAD_PROV_RECORDS"
}

export const onURILoaded = (id, uri) => ({
    type: types.uriLoaded,
    uri: new Uri(id, uri)
});

export const onProvRecordsLoaded = (uri, records) => ({
    type: types.provRecordsLoaded,
    provRecords: new ProvRecords(uri, records)
});

export const onProvRecordsShow = (address, uri, loaded) => ({
    type: types.showProvRecords,
    address,
    uri,
    loaded
});

export const onProvRecordsLoad = (address, uri) => ({
    type: types.loadProvRecords,
    address,
    uri
});