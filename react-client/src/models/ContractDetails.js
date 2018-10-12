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
}