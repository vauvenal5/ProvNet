import * as Rx from "rxjs";
import { 
    map,  
    flatMap, 
    catchError,
    filter,
    reduce,
    last,
    retry,
    delay} from "rxjs/operators";
import * as Rp from "request-promise";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import Network from "./network";
import Contract from "./contract";
import CostCounter from "./CostCounter";
import PersistableHelper from "./PersistableHelper";
import restHelper from "./RestHelper";

export default class Deployer extends PersistableHelper {
    constructor(network, persist, skipSearch) {
        super(network, persist, "contracts", e => e.contract.length, e => e.contract);
        this.skipSearch = skipSearch;
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

                return restHelper.postAndPull("http://localhost:3001/contracts/deploy", "http://localhost:3001/contracts/deploy/"+title, {
                    title: title
                }).pipe(
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
                    }),
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

    deploySearch(count) {
        if(this.skipSearch) {
            return this.deployContract("Search"+count);
        }

        return Rx.zip(
            this.deployContract("Search"+count),
            this.deployUniversity("Uni"+count, 2, (count/4)-2),
            (search, uni) => {
                search.children.push(uni);
                return search;
            }
        )
    }

    deployDefault() {
        return Rx.zip(
            this.deployContract("Proj-Cloud"),
            this.deployContract("DSG"),
            this.deployNodeWithChildren("InfoSys", "Group", 1),
            this.deployNodeWithChildren("InstX", "Group", 2),
            this.deployContract("TU"),
            this.deploySearch(16),
            this.deploySearch(32),
            this.deploySearch(64),
            this.deploySearch(128),
            this.deploySearch(256),
            (proj, dsg, infosys, instx, tu, search16, search32,
                search64, search128, search256) => {
                    search256.children.push(search128);
                    search128.children.push(search64);
                    search64.children.push(search32);
                    search32.children.push(search16);
                    search16.children.push(tu);
                    tu.children.push(instx);
                    tu.children.push(infosys);
                    infosys.children.push(dsg);
                    dsg.children.push(proj);

                    return new Network(proj, dsg, infosys, instx, tu, search16, search32, search64, search128, search256);
            }
        )
    }
}