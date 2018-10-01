pragma solidity ^0.4.24;

import "../../../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";

import "./ProvLinkLib.sol";
import "./ProvLinkListLib.sol";
import "../Uint256Utils.sol";
import "../LinkedList/LinkedListIteratorLib.sol";
import "./LinkListIteratorExtensionLib.sol";

library ProvLinkQueryLib {
    using ProvLinkListLib for ProvLinkListLib.LinkList;
    using ProvLinkQueryLib for ProvLinkListLib.LinkList;
    using SafeMath for uint256;
    using Uint256Utils for uint256;
    using LinkListIteratorExtensionLib for LinkedListIteratorLib.Iterator;

    function getLinkCountForType(ProvLinkListLib.LinkList storage self, uint256 _type) internal 
    view 
    returns (uint256) {
        LinkedListIteratorLib.Iterator memory iterator = self.getIterator();
        uint256 count = 0;

        (bool hasNext, uint256 next) = iterator.getNextByType(self, _type);
        while(hasNext) {
            count = count.add(1);
            (hasNext, next) = iterator.getNextByType(self, _type);
        }

        return count;
    }

    function getLinkCountForUrl(ProvLinkListLib.LinkList storage self, string _url) internal 
    view 
    returns (uint256) {
        LinkedListIteratorLib.Iterator memory iterator = self.getIterator();
        uint256 count = 0;

        (bool hasNext, uint256 next) = iterator.getNextByUrl(self, _url);
        while(hasNext) {
            count = count.add(1);
            (hasNext, next) = iterator.getNextByUrl(self, _url);
        }

        return count;
    }

    function getLinkCountForUrlAndType(ProvLinkListLib.LinkList storage self, uint256 _type, string _url) internal 
    view 
    returns (uint256) {
        LinkedListIteratorLib.Iterator memory iterator = self.getIterator();
        uint256 count = 0;

        (bool hasNext, uint256 next) = iterator.getNextByType(self, _type);
        while(hasNext) {
            ProvLinkLib.Link storage link = self.getLink(next);
            if(link.hasProvenance[_url]) {
                count = count.add(1);
            }
            (hasNext, next) = iterator.getNextByType(self, _type);
        }

        return count;
    }

    function getLinkListForType(ProvLinkListLib.LinkList storage self, uint256 _type) public 
    view 
    returns (address[]) {
        address[] memory links = new address[](self.getLinkCountForType(_type));
        LinkedListIteratorLib.Iterator memory iterator = self.getIterator();
        uint256 count = 0;

        (bool hasNext, uint256 next) = iterator.getNextByType(self, _type);
        while(hasNext) {
            links[count] = next.toAddress();
            count = count.add(1);
            (hasNext,next) = iterator.getNextByType(self, _type);
        }

        return links;
    }

    /*function getHasProvenanceLinks(LinkList storage self, string _url) public view returns (address[]) {

    }*/
}