export default class State {
    constructor(id, props) {
        this.id = id;
        this.props = Object.assign({}, props);
    }

    static getStateProps(self) {
        return self.props;
    }

    static isState(self, state) {
        return self.id === state;
    }

    static CLEARED = 0;
    static SUCCESS = 1;
    static ERROR = 2;
    static LOADING = 3;

    static createStateCleared(props) {
        return new State(State.CLEARED, props);
    }

    static createStateSuccess(props) {
        return new State(State.SUCCESS, props);
    }

    static createStateError(props) {
        return new State(State.ERROR, props);
    }

    static createStateLoading(props) {
        return new State(State.LOADING, props);
    }
}