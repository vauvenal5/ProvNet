import * as Rx from "rxjs";
import { flatMap, filter, map, switchAll, reduce } from "rxjs/operators";
import * as Rp from "request-promise";
import Network from "./network";
import Contract from "./contract";

export default class Linker {

    getLinks(node) {
        return Rx.from(
            Rp.get("http://localhost:3001/contracts/"+node.address+"/links", {json: true})
        ).pipe(
            switchAll(),
            map(link => link.address),
            reduce((links, link)=> {
                links.push(link); 
                return links;
            },[])
        );
    }

    linkNetwork(node = new Contract("empty", "0"), tag) {
        return this.getLinks(node).pipe(
            flatMap(links => Rx.from(node.children).pipe(
                flatMap(child => Rx.merge(
                    this.linkChild(node, child, links, tag),
                    this.linkNetwork(child, tag)
                ))
            ))
        )
    }

    linkNode(node = new Contract("empty", "0"), child, tag) {
        return this.getLinks(node).pipe(
            flatMap(links => this.linkChild(node, child, links, tag))
        )
    }

    linkChild(node, child, links, tag) {
        return Rx.of(child).pipe(
            filter(child => {
                if(links.includes(child.address)) {
                    console.log("Skipping link: "+node.address+" => "+child.address);
                    return false;
                }

                console.log("Linking: " + node.address + " => "+ child.address);
                return true;//do not filter; link does not exist;
            }),
            flatMap(child => Rx.from(
                Rp.put("http://localhost:3001/contracts/"+node.address+"/links/"+child.address, {
                    body: {
                        tag: tag
                    },
                    json: true
                })
            ))
        );
    }
}