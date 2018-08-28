pragma solidity ^0.4.24;

import "../../../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";

import "./ProvLinkLib.sol";
import "../Uint256Utils.sol";
import "../LinkedList/LinkedListIteratorLib.sol";
import "./LinkListIteratorExtensionLib.sol";

library ProvLinkQueryLib {
    using ProvLinkLib for ProvLinkLib.LinkList;
    using ProvLinkQueryLib for ProvLinkLib.LinkList;
    using SafeMath for uint256;
    using Uint256Utils for uint256;
    using LinkListIteratorExtensionLib for LinkedListIteratorLib.Iterator;

    function getLinkCountForType(ProvLinkLib.LinkList storage self, uint256 _type) internal 
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

    function getLinkCountForUrl(ProvLinkLib.LinkList storage self, string _url) internal 
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

    function getLinkCountForUrlAndType(ProvLinkLib.LinkList storage self, uint256 _type, string _url) internal 
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

    function getLinkListForType(ProvLinkLib.LinkList storage self, uint256 _type) public 
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