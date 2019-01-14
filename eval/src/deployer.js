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
import PersistableHelper from "./PersistableHelper";

export default class Deployer extends PersistableHelper {
    constructor(network, persist) {
        super(network, persist, "contracts", e => e.contract.length, e => e.contract);
    }

    isContractDeployed(title) {
        return this.getNetworkedTopic()[title] !== undefined;
    }

    getAddress(title) {
        return this.getNetworkedTopic()[title].address;
    }

    getAddressArray() {
        let contracts = [];
        for(let contract in this.contracts[this.network]) {
            contracts.push(this.contracts[this.network][contract]);
        }
        return contracts;
    }

    getChildNodePrefix(name, childName) {
        return name + "-" + childName;
    }

    deployContract(title) {
        return Rx.of(title).pipe(
            flatMap(title => {
                if(this.isContractDeployed(title)) {
                    console.log("Skipping: "+title);
                    this.costCounter.next(this.contracts[this.network][title]);
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
                        let add = contract.contractAddress.toLowerCase();

                        let out = {
                            event: "ContractDeployed",
                            contract: title,
                            address: add,
                            cost: contract.gasUsed
                        }

                        this.addEvent(out);

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

    deployUniversity(name, inst, groups) {
        return this.deployNodeWithChildren(name, "Inst", inst).pipe(
            flatMap(uni => this.deployChildrenForNodes(uni.children, "Group", groups).pipe(
                last(node => true),
                map(node => uni)
            ))
        );
    }

    deployDefault() {
        return Rx.zip(
            this.deployContract("Proj-Cloud"),
            this.deployContract("DSG"),
            this.deployNodeWithChildren("InfoSys", "Group", 1),
            this.deployNodeWithChildren("InstX", "Group", 2),
            this.deployContract("TU"),
            this.deployUniversity("UniY", 2, 2),
            this.deployContract("Search16"),
            this.deployUniversity("UniX", 2, 6),
            this.deployContract("Search32"),
            this.deployContract("Search64"),
            this.deployContract("Search128"),
            this.deployContract("Search256"),
            //this.deployUniversity("UniY", 10),
            //(dsg, infosys, tu, unix, uniy) => ({dsg, infosys, tu, unix, uniy})
            (dsg, infosys, tu) => new Network(dsg, infosys, tu)
        )
    }
}