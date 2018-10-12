export default class Select {
    constructor() {
        this.selected = "";
    }

    setSelected(selected) {
        return this.softClone({selected: selected});
    }

    getSelected() {
        return this.selected;
    }

    softClone(o) {
        return Object.assign(new Select(), this, o);
    }
}