pragma solidity ^0.4.24;

import "../LinkedList/LinkedListIteratorLib.sol";
import "./ProvLinkLib.sol";
import "./ProvLinkListLib.sol";
import "../TagLib.sol";

library LinkListIteratorExtensionLib {
    using LinkedListIteratorLib for LinkedListIteratorLib.Iterator;
    using ProvLinkListLib for ProvLinkListLib.LinkList;
    using TagLib for TagLib.TagList;

    function getNextByUrl(LinkedListIteratorLib.Iterator memory self, ProvLinkListLib.LinkList storage list, string _url) 
    internal 
    view 
    returns (bool, uint256) {  
        (bool hasNext, uint256 next) = self.getNext(list.keys);
        while(hasNext) {
            ProvLinkLib.Link storage link = list.getLink(next);

            if(link.hasProvenance[_url]) {
                return (true, next);
            }

            (hasNext, next) = self.getNext(list.keys);
        }

        return (false, 0);
    }

    function getNextByType(LinkedListIteratorLib.Iterator memory self, ProvLinkListLib.LinkList storage list, uint256 _type) internal 
    view 
    returns (bool, uint256) {       
        (bool hasNext, uint256 next) = self.getNext(list.keys);
        while(hasNext) {
            ProvLinkLib.Link storage link = list.getLink(next);

            if(link.types[_type]) {
                return (true, next);
            }

            (hasNext, next) = self.getNext(list.keys);
        }
        return (false, 0);
    }
}