export default class ProvRecords {
    constructor(uri, records=[]) {
        this.uri = uri;
        this.records = records;
    }

    getUri() {
        return this.uri;
    }

    static getUri(self) {
        return self.getUri();
    }

    getRecords() {
        return this.records;
    }

    putRecord(record) {
        return this.softClone({
            records: [...this.records, record]
        });
    }

    static putRecord(self, record) {
        return self.putRecord(record);
    }

    softClone(o) {
        return Object.assign(new ProvRecords(), this, o);
    }
}