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
            items: {
                ...this.items,
                [this.getIdFunc(item)]: item
            }
        });
    }

    static add(list, item) {
        return list.add(item);
    }

    get(id) {
        let item = this.items[id];
        if(item) {
            return item;
        }
        return this.emptyItemConstructor(id);
    }

    static get(self, id) {
        return self.get(id);
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
}