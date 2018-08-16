pragma solidity ^0.4.24;

import "../../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";
import "../../node_modules/ethereum-libraries-linked-list/contracts/LinkedListLib.sol";
import "./AddressUtils.sol";
import "./TagLibrary.sol";

library ProvenanceLinkLibrary {
    using ProvenanceLinkLibrary for ProvenanceLinkLibrary.LinkList;
    using LinkedListLib for LinkedListLib.LinkedList;
    using TagLibrary for TagLibrary.TagList;
    using AddressUtils for address;

    struct Link {
        address provenanceContract;
        TagLibrary.TagList types;
        //todo-sv: is this neccessary? or can we solve hasProvenance by querrying all the contracts for information?
        mapping (string => bool) hasProvenance;
    }

    struct LinkList {
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
    function addLink(LinkList storage self, address _contract, TagLibrary.Tag _type) internal 
    linkDoesNotExist(self, _contract) {
        self.linkIndex.push(_contract.toUint256(), false);
        
        //Link storage link = self.links[_contract];
        self.links[_contract].provenanceContract = _contract;
        self.links[_contract].types.addTag(_type);
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

    //todo-sv: check if modifiers get applied to this function
    function addLinkWithProvenance(LinkList storage self, address _contract, TagLibrary.Tag _type, string _url) internal {
        self.addLink(_contract, _type);
        self.setLinkHasProvenance(_contract, _url, true);
    }
}