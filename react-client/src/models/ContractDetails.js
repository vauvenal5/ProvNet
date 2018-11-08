import ProvContract from "./ProvContract";

export default class ContractDetails {
    constructor(title = "", description = "", logoUrl = "") {
        this.title = title;
        this.description = description;
        this.logoUrl = logoUrl;
    }

    getTitle() {
        return this.title;
    }

    getDescription() {
        return this.description;
    }

    getLogoUrl() {
        return this.logoUrl;
    }

    static getTitle(details) {
        if(details === undefined) {
            return "";
        }
        
        return details.getTitle();
    }

    static getDescription(details) {
        return details.description;
    }

    static getLogoUrl(details) {
        return details.getLogoUrl();
    }
}