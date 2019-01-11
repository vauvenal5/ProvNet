import * as Rx from "rxjs";
import { 
    map,  
    flatMap, 
    catchError,
    filter,
    reduce,
    last} from "rxjs/operators";
import * as Rp from "request-promise";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import Network from "./network";
import Contract from "./contract";
import CostCounter from "./CostCounter";

export default class Deployer {
    constructor(network, persist, costCounter) {
        this.config = {};
        this.config.dir = "./config";
        this.config.path = this.config.dir + "/contracts.json";
        this.config.persist = persist;
        this.network = network;
        
        this.contracts = {};
        this.costCounter = new CostCounter(network, persist);
        
        if(!existsSync(this.config.dir)) {
            mkdirSync(this.config.dir);
        }

        if(existsSync(this.config.path)) {
            this.contracts = JSON.parse(readFileSync(this.config.path), "utf8");
        }

        if(this.contracts[this.network] === undefined) {
            this.resetNetwork();
        }

        this.costCounter = costCounter;
    }

    resetNetwork() {
        this.contracts[this.network] = {};
    }

    isContractDeployed(title) {
        return this.contracts[this.network][title] !== undefined;
    }

    getAddress(title) {
        return this.contracts[this.network][title];
    }

    getAddressArray() {
        let contracts = [];
        for(let contract in this.contracts[this.network]) {
            contracts.push(this.contracts[this.network][contract]);
        }
        return contracts;
    }

    persist() {
        if(this.config.persist) {
            writeFileSync(
                this.config.path, 
                JSON.stringify(this.contracts, null, 4), 
                "utf8"
            );
        }
    }

    setAddress(title, address) {
        return this.contracts[this.network][title] = address;
    }

    getChildNodePrefix(name, childName) {
        return name + "-" + childName;
    }

    deployContract(title) {
        return Rx.of(title).pipe(
            flatMap(title => {
                if(this.isContractDeployed(title)) {
                    console.log("Skipping: "+title);
                    return Rx.of(new Contract(title, this.getAddress(title)));
                }

                return Rx.from(
                    Rp.put("http://localhost:3001/contracts/deploy", {
                        body: {
                            title: title
                        },
                        json: true
                    })
                ).pipe(
                    map(contract => {
                        let add = contract.contractAddress;
                        this.setAddress(title, add);
                        this.persist();

                        let out = {
                            event: "ContractDeployed",
                            contract: title,
                            address: add,
                            cost: contract.gasUsed
                        }
                        console.log(out);
                        this.costCounter.contractSubject.next(out);

                        return new Contract(title, add);
                    })
                );
            })
        );
    }

    deployXContracts(x, prefix) {
        return Rx.range(0, x).pipe(
            map(num => prefix+num),
            flatMap(title => this.deployContract(title)),
            reduce((contracts, contract) => {
                contracts.push(contract);
                return contracts;
            }, [])
        );
    }

    deployChildrenForNodes(nodes, childName, childrenCount) {
        return Rx.from(nodes).pipe(
            flatMap(node => Rx.zip(
                Rx.of(node),
                this.deployXContracts(childrenCount, this.getChildNodePrefix(node.title, childName)),
                (node, children) => {
                    node.children = children;
                    return node;
                }
            ))
        );
    }

    deployNodeWithChildren(nodeName, childName, childrenCount) {
        let prefix = nodeName+"-"+childName;
        return Rx.zip(
            this.deployContract(nodeName),
            this.deployXContracts(childrenCount, prefix),
            (node, children) => {
                node.children = children;
                return node;
            }
        );
    }

    deployUniversity(name, count) {
        return this.deployNodeWithChildren(name, "Inst", count).pipe(
            flatMap(uni => this.deployChildrenForNodes(uni.children, "Group", count).pipe(
                last(node => true),
                map(node => uni)
            ))
        );
    }

    deployDefault() {
        return Rx.zip(
            this.deployContract("DSG"),
            this.deployNodeWithChildren("InfoSys", "Group", 8),
            this.deployUniversity("TU", 9),
            //this.deployUniversity("UniX", 10),
            //this.deployUniversity("UniY", 10),
            //(dsg, infosys, tu, unix, uniy) => ({dsg, infosys, tu, unix, uniy})
            (dsg, infosys, tu) => new Network(dsg, infosys, tu)
        )
    }
}