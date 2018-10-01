pragma solidity ^0.4.24;

import "../../../node_modules/ethereum-libraries-linked-list/contracts/LinkedListLib.sol";
import "../AddressUtils.sol";
import "../TagLib.sol";
import "../Uint256Utils.sol";
import "../LinkedList/LinkedListExtensionLib.sol";

library ProvLinkLib {
    using ProvLinkLib for ProvLinkLib.LinkList;
    using LinkedListLib for LinkedListLib.LinkedList;
    using LinkedListExtensionLib for LinkedListLib.LinkedList;
    using TagLib for TagLib.TagList;
    using AddressUtils for address;
    using Uint256Utils for uint256;

    struct Link {
        address provenanceContract;
        //key is the tag; since the existing tags are allways dependent from the contract holding the link we can in any view layer simply traverse the tags and check for every tag if it is in the link
        //or I can keep a TagList were the title field is never set since it is not neccessary to set it but I think this way it is cheaper since I am avoiding to keep the unnecessary keys-list
        mapping (uint256 => bool) types;
        //todo-sv: is this neccessary? or can we solve hasProvenance by querrying all the contracts for information?
        mapping (string => bool) hasProvenance;
    }

    struct LinkList {
        //todo-sv: rename to keys
        LinkedListLib.LinkedList linkIndex;
        mapping (address => Link) links;
    }

    modifier linkExists(LinkList storage self, address index) {
        require(self.linkIndex.nodeExists(index.toUint256()), "Link does not exist!");
        _;
    }

    modifier linkDoesNotExist(LinkList storage self, address index) {
        require(!self.linkIndex.nodeExists(index.toUint256()), "Link allready exists!");
        _;
    }

    //todo-sv: read up on function modifiers in libraries; are there any security risks? will the access control in the contract function like expected?
    function addLink(LinkList storage self, address _contract, uint256 _type) internal 
    linkDoesNotExist(self, _contract) {
        self.linkIndex.push(_contract.toUint256(), false);
        
        Link storage link = self.links[_contract];
        link.provenanceContract = _contract;
        link.types[_type] = true;
    }

    //todo-sv: check if modifiers get applied to this function
    function addLink(LinkList storage self, address _contract, uint256 _type, string _url) internal {
        self.addLink(_contract, _type);
        self.setLinkHasProvenance(_contract, _url, true);
    }

    function removeLink(LinkList storage self, address _contract) internal 
    linkExists(self, _contract) {
        self.linkIndex.remove(_contract.toUint256());
        //todo: value is only removed from index not from mapping... problem?
    }

    function setLinkHasProvenance(LinkList storage self, address _contract, string _url, bool _hasProvenance) internal 
    linkExists(self, _contract){
        self.links[_contract].hasProvenance[_url] = _hasProvenance;
    }

    function getLink(ProvLinkLib.LinkList storage self, uint256 _pointer) internal 
    view 
    returns (ProvLinkLib.Link storage) {
        return self.getLink(_pointer.toAddress());
    }

    //todo-sv: check exists is missing
    function getLink(ProvLinkLib.LinkList storage self, address _pointer) internal 
    view 
    returns (ProvLinkLib.Link storage) {
        return self.links[_pointer];
    }

    function getIterator(ProvLinkLib.LinkList storage self) 
    internal 
    view 
    returns(LinkedListIteratorLib.Iterator) {
        return self.linkIndex.getIterator();
    }
}