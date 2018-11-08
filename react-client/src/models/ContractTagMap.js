import { Tag } from ".";
import TagList from "./TagList";

export class ContractTagMap {

    createOrGet(address) {
        if(this[address]) {
            return this[address];
        }
        return new TagList();
    }

    static assignRole(map, address, tag) {
        let tags = map.createOrGet(address);
        return map.softClone({
            [address]: TagList.addTag(tags, tag)
        });
    }

    static getTags(map, address) {
        return map.createOrGet(address);
    }

    softClone(o) {
        return Object.assign(new ContractTagMap(), this, o);
    }
}