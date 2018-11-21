import State from "./EditModelState";

export default class EditModel {
    constructor(id = "", address = "") {
        this.address = address;
        this.id = id;
        this.open = false;
        this.state = State.createStateCleared();
    }

    setAddress(address) {
        return this.softClone({address});
    }

    static setAddress(self, address) {
        return self.setAddress(address);
    }

    static getAddress(self) {
        return self.address;
    }

    setId(id) {
        return this.softClone({id: id});
    }

    getId() {
        return this.id;
    }

    static getId(modal) {
        return modal.getId();
    }

    isOpen() {
        return this.open;
    }

    static isOpen(self) {
        return self.isOpen();
    }

    setOpen(value) {
        return this.softClone({open: value});
    }

    static setOpen(modal, value) {
        return modal.setOpen(value);
    }

    getStateProps() {
        return State.getStateProps(this.state);
    }

    static getStateProps(self) {
        return self.getStateProps();
    }

    isState(state) {
        return State.isState(this.state, state);
    }

    isCleared() {
        return this.isState(State.CLEARED);
    }

    isSuccess() {
        return this.isState(State.SUCCESS);
    }

    static isSuccess(self) {
        return self.isSuccess();
    }

    isError() {
        return this.isState(State.ERROR);
    }

    static isError(self) {
        return self.isError();
    }

    isLoading() {
        return this.isState(State.LOADING);
    }

    static isLoading(self) {
        return self.isLoading();
    }

    setCleared(props) {
        return this.setState(State.createStateCleared(props));
    }

    static setCleared(self, props) {
        return self.setCleared(props);
    }

    setSuccess(props) {
        return this.setState(State.createStateSuccess(props));
    }

    static setSuccess(self, props) {
        return self.setSuccess(props);
    }

    setError(props) {
        return this.setState(State.createStateError(props));
    }

    static setError(self, props) {
        return self.setError(props);
    }

    setLoading(props) {
        return this.setState(State.createStateLoading(props));
    }

    static setLoading(self, props) {
        return self.setLoading(props);
    }

    setState(state) {
        return this.softClone({state: state});
    }

    softClone(o) {
        return Object.assign(new EditModel(), this, o);
    }
}