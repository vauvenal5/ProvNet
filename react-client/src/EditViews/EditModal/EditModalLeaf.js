import EditModal from "./EditModal";

export default class EditModalLeaf extends EditModal {
    constructor(id) {
        super(id, true);

        this.states = {};
        this.states.cleared = 0;
        this.states.success = 1;
        this.states.error = 2;
        this.states.loading = 3;
        
        this.state = this.states.cleared;
    }

    isState(state) {
        return this.state === state;
    }

    isCleared() {
        return this.isState(this.states.cleared);
    }

    isSuccess() {
        return this.isState(this.states.success);
    }

    isError() {
        return this.isState(this.states.error);
    }

    isLoading() {
        return this.isState(this.states.loading);
    }

    setCleared() {
        return this.setState(this.states.cleared);
    }

    setSuccess() {
        return this.setState(this.states.success);
    }

    setError() {
        return this.setState(this.states.error);
    }

    setLoading() {
        return this.setState(this.states.loading);
    }

    static setLoading(self) {
        return self.setLoading();
    }

    setState(state) {
        return this.softClone({state: state});
    }

    softClone(o) {
        return Object.assign(new EditModalLeaf(), this, o);
    }
}