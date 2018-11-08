export default class List {
    constructor(getIdFunc, ...items) {
        this.getIdFunc = getIdFunc;
        this.items = {};
        items.map((item) => this.items[this.getIdFunc(item)] = item);
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
        return this.items[id];
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
        return Object.assign(new List(), this, o);
    }
}