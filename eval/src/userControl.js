import * as Rx from "rxjs";
import { flatMap, filter, map } from "rxjs/operators";
import * as Rp from "request-promise";
import PersistableHelper from "./PersistableHelper";
import CostCounter from "./CostCounter";

export default class UserControl extends PersistableHelper {
    constructor(network, persist) {
        super(network, persist, "users", e => e.role.length, e => this.createEventKey(e.contract, e.role));

        this.roleMaps = {
            links: {1: "trusted", 2: "known", 3: "pingback"},
            specials: {1: "superuser", 2: "editor"}
        };

        this.roleIndex = {
            links: {trusted: 1, known: 2},
            specials: {superuser: 1, editor: 2}
        };
    }

    createEventKey(contract, role) {
        return contract + ":" + role;
    }

    addEvent(roleAdded, gasUsed, title) {
        let out = {
            event: roleAdded.event,
            contract: title,
            address: roleAdded.address.toLowerCase(),
            user: roleAdded.returnValues.operator.toLowerCase(),
            role: roleAdded.returnValues.role,
            cost: gasUsed
        };

        super.addEvent(out);
    }

    checkExpectedRoles(user, contract, roleProp, expectedRoles) {
        return Rx.from(expectedRoles).pipe(
            filter(tag => {
                if(user[roleProp].includes(""+tag)) {
                    console.log("Skipping contract: "+contract.contract+" for role: " + this.roleMaps[roleProp][tag]);
                    this.costCounter.next(this.getNetworkedTopic()[this.createEventKey(contract.contract, this.roleMaps[roleProp][tag])]);
                    return false;
                }
                return true;
            }),
            map(tag => this.roleMaps[roleProp][tag]),
        );
    }

    checkRights(contracts, user, expectedLinks, expectedSpecials) {
        return Rx.from(contracts).pipe(
            flatMap(contract => Rx.from(
                Rp.get("http://localhost:3001/contracts/"+contract.address+"/users/"+user, {json: true})
            ).pipe(
                flatMap(user => Rx.merge(
                    this.checkExpectedRoles(user, contract, "links", expectedLinks),
                    this.checkExpectedRoles(user, contract, "specials", expectedSpecials),
                )),
                flatMap(tag => Rx.from(
                    Rp.put("http://localhost:3001/contracts/"+contract.address+"/users/"+user, {
                        body: {
                            tag: tag
                        },
                        json: true
                    })
                )),
                map(receipt => ({contract: contract.contract, receipt}))
            ))
        );
    }
}