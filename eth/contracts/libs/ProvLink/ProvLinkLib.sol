pragma solidity ^0.4.24;

import "../TagLib.sol";
import "../LinkedList/LinkedListIteratorLib.sol";

library ProvLinkLib {
    using ProvLinkLib for ProvLinkLib.Link;
    using TagLib for TagLib.TagList;
    using LinkedListIteratorLib for LinkedListIteratorLib.Iterator;

    struct Link {
        address provenanceContract;
        //key is the tag; since the existing tags are allways dependent from the contract holding the link we can in any view layer simply traverse the tags and check for every tag if it is in the link
        //or I can keep a TagList were the title field is never set since it is not neccessary to set it but I think this way it is cheaper since I am avoiding to keep the unnecessary keys-list
        mapping (uint256 => bool) types;
        //todo-sv: is this neccessary? or can we solve hasProvenance by querrying all the contracts for information?
        mapping (string => bool) hasProvenance;
    }

    function toReturnValue(Link storage self, TagLib.TagList storage contractTypes)
    public
    view
    returns(address, uint256[]) {
        uint256[] memory types = new uint256[](contractTypes.sizeOf());

        LinkedListIteratorLib.Iterator memory iterator = contractTypes.getIterator();

        (bool hasNext, uint256 next) = iterator.getNext(contractTypes.getKeyList());

        uint256 counter = 0;
        while(hasNext) {
            //todo-sv: hide this behind getter
            TagLib.Tag memory tag = contractTypes.getTag(next);
            if(self.types[tag.id]) {
                types[counter] = tag.id;
                counter++;
            }
            (hasNext, next) = iterator.getNext(contractTypes.getKeyList());
        }

        return (self.provenanceContract, types);
    }
}