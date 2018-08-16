pragma solidity ^0.4.24;

import "../../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";
import "../../node_modules/ethereum-libraries-linked-list/contracts/LinkedListLib.sol";

import "./ProvenanceLinkLibrary.sol";
import "./TagLibrary.sol";
import "./Uint256Utils.sol";

library ProvenanceLinkQueryLibrary {
    using ProvenanceLinkLibrary for ProvenanceLinkLibrary.LinkList;
    using ProvenanceLinkQueryLibrary for ProvenanceLinkLibrary.LinkList;
    using TagLibrary for TagLibrary.TagList;
    using LinkedListLib for LinkedListLib.LinkedList;
    using SafeMath for uint256;
    using Uint256Utils for uint256;

    function getLinkCountForType(ProvenanceLinkLibrary.LinkList storage self, uint256 _type) internal 
    view 
    returns (uint256) {
        uint256 count = 0;

        (bool exists, uint256 pointer) = self.hasNextByType(0, _type);
        while(exists) {
            count = count.add(1);
            (exists,pointer) = self.hasNextByType(pointer, _type);
        }

        return count;
    }

    function getLinkCountForUrl(ProvenanceLinkLibrary.LinkList storage self, string _url) internal 
    view 
    returns (uint256) {
        uint256 count = 0;

        (bool exists, uint256 pointer) = self.hasNextByUrl(0, _url);
        while(exists) {
            count = count.add(1);
            (exists, pointer) = self.hasNextByUrl(pointer, _url);
        }

        return count;
    }

    function getLinkCountForUrlAndType(ProvenanceLinkLibrary.LinkList storage self, uint256 _type, string _url) internal 
    view 
    returns (uint256) {
        address[] memory typed = self.getLinkListForType(_type);
        uint256 count = 0;

        for(uint256 i = 0; i < typed.length; i++) {
            ProvenanceLinkLibrary.Link storage link = self.links[typed[i]];
            if(link.hasProvenance[_url]) {
                count = count.add(1);
            }
        }

        return count;
    }

    function getLinkListForType(ProvenanceLinkLibrary.LinkList storage self, uint256 _type) public 
    view 
    returns (address[]) {
        address[] memory links = new address[](self.getLinkCountForType(_type));
        uint256 count = 0;

        (bool exists, uint256 pointer) = self.hasNextByType(0, _type);
        while(exists) {
            links[count] = pointer.toAddress();
            count = count.add(1);
            (exists,pointer) = self.hasNextByType(pointer, _type);
        }

        return links;
    }

    /*function getHasProvenanceLinks(LinkList storage self, string _url) public view returns (address[]) {

    }*/

    function hasNext(ProvenanceLinkLibrary.LinkList storage self, uint256 _pointer) internal 
    view 
    returns (bool, uint256) {
        //fake constants: this way they are only stored on stack until constants issue gets fixed
        //https://github.com/ethereum/solidity/issues/1290
        //we actually want to be abel to do: LinkedListLib.HEAD
        uint256 HEAD = 0;
        bool NEXT = true;
        
        (, uint256 pointer) = self.linkIndex.getAdjacent(_pointer, NEXT);
        if(pointer != HEAD) {
            return (true, pointer);
        }
        return (false, 0);
    }

    function hasNextByUrl(ProvenanceLinkLibrary.LinkList storage self, uint256 _pointer, string _url) internal 
    view 
    returns (bool, uint256) {        
        (bool next, uint256 pointer) = self.hasNext(_pointer);
        while(next) {
            ProvenanceLinkLibrary.Link storage link = self.getLinkForUint256(pointer);
            
            if(link.hasProvenance[_url]) {
                return (true, pointer);
            }

            (next, pointer) = self.hasNext(pointer);
        }
        return (false, 0);
    }

    function hasNextByType(ProvenanceLinkLibrary.LinkList storage self, uint256 _pointer, uint256 _type) internal 
    view 
    returns (bool, uint256) {        
        (bool next, uint256 pointer) = self.hasNext(_pointer);
        while(next) {
            ProvenanceLinkLibrary.Link storage link = self.getLinkForUint256(pointer);
            
            if(link.types.hasTag(_type)) {
                return (true, pointer);
            }

            (next, pointer) = self.hasNext(pointer);
        }
        return (false, 0);
    }

    //todo-sv: check exists is missing
    //todo-sv: get single link should be part of list
    function getLinkForUint256(ProvenanceLinkLibrary.LinkList storage self, uint256 _pointer) internal 
    view 
    returns (ProvenanceLinkLibrary.Link storage) {
        return self.links[_pointer.toAddress()];
    }
}