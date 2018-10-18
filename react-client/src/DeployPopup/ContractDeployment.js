export default class ContractDeployment {
    constructor() {
        this.open = false;
        this.cleared = 0;
        this.success = 1;
        this.error = 2;
        this.loading = 3;
        this.state = this.cleared;
        this.address = "";
    }

    setAddress(address) {
        return this.softClone({address: address});
    }

    getAddress() {
        return this.address;
    }

    isState(state) {
        return this.state === state;
    }

    isCleared() {
        return this.isState(this.cleared);
    }

    isSuccess() {
        return this.isState(this.success);
    }

    isError() {
        return this.isState(this.error);
    }

    isLoading() {
        return this.isState(this.loading);
    }

    isOpen() {
        return this.open;
    }

    setOpen(value) {
        return this.softClone({open: value});
    }

    setCleared() {
        return this.setState(this.cleared);
    }

    setSuccess() {
        return this.setState(this.success);
    }

    setError() {
        return this.setState(this.error);
    }

    setLoading() {
        return this.setState(this.loading);
    }

    setState(state) {
        return this.softClone({state: state});
    }

    softClone(o) {
        return Object.assign(new ContractDeployment(), this, o);
    }
}