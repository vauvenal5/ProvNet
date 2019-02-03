import * as Rx from "rxjs";
import { flatMap, filter, map, switchAll, reduce } from "rxjs/operators";
import * as Rp from "request-promise";
import Network from "./network";
import Contract from "./contract";
import PersistableHelper from "./PersistableHelper";
import CostCounter from "./CostCounter";
import restHelper from "./RestHelper";

export default class Linker extends PersistableHelper {
    constructor(network, persist) {
        super(network, persist, "links", e => e.tag, e => this.createEventKey(e.from, e.to, e.tag));
    }

    createEventKey(from, to, tag) {
        return from + "=>" + this.createLinkTagKey(to, tag);
    }

    createLinkTagKey(link, tag) {
        return link + ":" + tag;
    }

    addEvent(event, gasUsed, from, to) {
        let out = {
            event: event.event,
            from: from,
            fromAddress: event.address.toLowerCase(),
            to: to,
            toAddress: event.returnValues.to.toLowerCase(),
            tag: event.returnValues.tag,
            cost: gasUsed
        };
        super.addEvent(out);
    }

    getLinks(node) {
        return restHelper.get("http://localhost:3001/contracts/"+node.address+"/links").pipe(
            switchAll(),
            flatMap(link => Rx.from(link.tags).pipe(
                map(tag => this.createLinkTagKey(link.address.toLowerCase(), tag))
            )),
            reduce((links, link)=> {
                links.push(link); 
                return links;
            },[])
        );
    }

    linkNetwork(node = new Contract("empty", "0")) {
        return this.getLinks(node).pipe(
            flatMap(links => Rx.from(node.children).pipe(
                flatMap(child => Rx.merge(
                    this.doubleLinkTrusted(node, child, links),
                    this.linkNetwork(child)
                ))
            ))
        )
    }

    linkNode(node = new Contract("empty", "0"), child, tag) {
        return this.getLinks(node).pipe(
            flatMap(links => this.link(node, child, links, tag))
        )
    }

    doubleLinkTrusted(node, child, links) {
        return Rx.merge(
            this.link(node, child, links, child.tag),
            Rx.of(child.tag).pipe(
                filter(tag => tag == 1),
                flatMap(tag => this.getLinks(child).pipe(
                    flatMap(childLinks => this.link(child, node, childLinks, tag))
                ))
            )
        );
    }

    link(node, child, links, tag) {
        return Rx.of(child).pipe(
            filter(child => {
                //console.log(child);
                if(links.includes(this.createLinkTagKey(child.address.toLowerCase(), tag))) {
                    console.log("Skipping link: "+node.title+" => "+child.title);
                    this.costCounter.next(this.getNetworkedTopic()[this.createEventKey(node.title,child.title,tag)]);
                    return false;
                }
                
                return true;//do not filter; link does not exist;
            }),
            flatMap(child => restHelper.postAndPull(
                "http://localhost:3001/contracts/"+node.address+"/links/"+child.address, 
                "http://localhost:3001/contracts/"+node.address+"/links/"+child.address+"/"+tag, 
                {
                    tag: tag
                }
            ).pipe(
                map(receipt => ({receipt, from: node.title, to: child.title}))
            ))
        );
    }
}