pragma solidity ^0.4.24;

import "../../../node_modules/ethereum-libraries-linked-list/contracts/LinkedListLib.sol";
import "../AddressUtils.sol";
import "../TagLib.sol";
import "../Uint256Utils.sol";
import "../LinkedList/LinkedListExtensionLib.sol";
import "../LinkedList/LinkedListIteratorLib.sol";
import "./ProvLinkLib.sol";
import "../LinkedList/LinkedListAdvancedExtensionLib.sol";

library ProvLinkListLib {
    using ProvLinkLib for ProvLinkLib.Link;
    using ProvLinkListLib for ProvLinkListLib.LinkList;
    using LinkedListLib for LinkedListLib.LinkedList;
    using LinkedListExtensionLib for LinkedListLib.LinkedList;
    using LinkedListIteratorLib for LinkedListIteratorLib.Iterator;
    using TagLib for TagLib.TagList;
    using AddressUtils for address;
    using Uint256Utils for uint256;
    using LinkedListAdvancedExtensionLib for LinkedListLib.LinkedList;

    struct LinkList {
        LinkedListLib.LinkedList keys;
        mapping (address => ProvLinkLib.Link) links;
    }

    modifier linkExists(LinkList storage self, address index) {
        require(self.keys.nodeExists(index.toUint256()), "Link does not exist!");
        _;
    }

    modifier linkDoesNotExist(LinkList storage self, address index) {
        require(!self.keys.nodeExists(index.toUint256()), "Link allready exists!");
        _;
    }

    //todo-sv: read up on function modifiers in libraries; are there any security risks? will the access control in the contract function like expected?
    function addLink(LinkList storage self, address _contract, uint256 _type) internal 
    linkDoesNotExist(self, _contract) {
        self.keys.push(_contract.toUint256(), false);
        
        ProvLinkLib.Link storage link = self.links[_contract];
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
        self.keys.remove(_contract.toUint256());
        //todo: value is only removed from index not from mapping... problem?
    }


    //todo-sv: not a list operation... move to link
    function setLinkHasProvenance(LinkList storage self, address _contract, string _url, bool _hasProvenance) internal 
    linkExists(self, _contract){
        self.links[_contract].hasProvenance[_url] = _hasProvenance;
    }

    function getLink(ProvLinkListLib.LinkList storage self, uint256 _pointer) internal 
    view 
    returns (ProvLinkLib.Link storage) {
        return self.getLink(_pointer.toAddress());
    }

    //todo-sv: check exists is missing
    function getLink(ProvLinkListLib.LinkList storage self, address _pointer) internal 
    view 
    returns (ProvLinkLib.Link storage) {
        return self.links[_pointer];
    }

    function getIterator(ProvLinkListLib.LinkList storage self) 
    internal 
    view 
    returns(LinkedListIteratorLib.Iterator) {
        return self.keys.getIterator();
    }

    function toReturnValue(ProvLinkListLib.LinkList storage self)
    public
    view
    returns(address[]) {
        // address[] memory addresses = new address[](self.keys.sizeOf());
        // uint256 counter = 0;
        // LinkedListIteratorLib.Iterator memory iterator = self.getIterator();

        // (bool hasNext, uint256 next) = iterator.getNext(self.keys);
        // while(hasNext) {
        //     addresses[counter] = next.toAddress();
        //     counter++;
        //     (hasNext, next) = iterator.getNext(self.keys);
        // }

        // return addresses;
        return self.keys.getKeysAddressArray();
    }
}