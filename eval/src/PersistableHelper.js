import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";

export default class PersistableHelper {
    constructor(network, persist, topic) {
        this.config = {
            topic: topic,
            dir: "./config",
            path: "",
            persist: persist
        };
        this.config.path = this.config.dir + "/" + topic + ".json";
        this.network = network;
        
        this[topic] = {};
        
        if(!existsSync(this.config.dir)) {
            mkdirSync(this.config.dir);
        }

        if(existsSync(this.config.path)) {
            this[topic] = JSON.parse(readFileSync(this.config.path), "utf8");
        }

        if(this[topic][this.network] === undefined) {
            this.resetNetwork();
        }
    }

    getNetworkedTopic() {
        return this[this.config.topic][network];
    }

    resetNetwork() {
        this[this.config.topic][this.network] = {};
    }

    persist() {
        if(this.config.persist) {
            writeFileSync(
                this.config.path, 
                JSON.stringify(this[this.config.topic], null, 4), 
                "utf8"
            );
        }
    }
}