export default class MapModel {
    constructor(id, getIdFunc, emptyItemConstructor, ...items) {
        this.id = id;
        this.getIdFunc = getIdFunc;
        this.emptyItemConstructor = emptyItemConstructor;
        this.items = {};
        items.map((item) => this.items[this.getIdFunc(item)] = item);
    }

    reset() {
        return this.softClone({
            items: {}
        });
    }

    static reset(self) {
        return self.reset();
    }

    getId() {
        return this.id;
    }

    static getId(self) {
        return self.getId();
    }

    add(item) {
        return this.softClone({
            items: Object.assign({}, this.items, {
                [this.getIdFunc(item)]: item
            })
        });
    }

    static add(list, item) {
        return list.add(item);
    }

    get(id) {
        if(this.has(id)) {
            return this.items[id];
        }
        return this.emptyItemConstructor(id);
    }

    static get(self, id) {
        return self.get(id);
    }

    has(id) {
        let item = this.items[id];
        if(item) {
            return true;
        }
        return false;
    }

    static has(self, id) {
        return self.has(id);
    }

    getItems() {
        return this.items;
    }

    static getItems(self) {
        return self.getItems();
    }

    softClone(o) {
        return Object.assign(new MapModel(), this, o);
    }

    forEach(cb) {
        for(let key in this.items) {
            cb(key, this.get(key));
        }
    }

    static forEach(self, cb) {
        self.forEach(cb);
    }

    mapToArray(cb) {
        let res = [];
        this.forEach((key, item) => res.push(cb(key, item)));
        return res;
    }

    static mapToArray(self, cb) {
        return self.mapToArray(cb);
    }
}