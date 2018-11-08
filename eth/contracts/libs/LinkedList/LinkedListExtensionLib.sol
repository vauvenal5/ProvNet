pragma solidity ^0.4.24;

import "../../../node_modules/ethereum-libraries-linked-list/contracts/LinkedListLib.sol";

import "./LinkedListIteratorLib.sol";

library LinkedListExtensionLib {
    using LinkedListLib for LinkedListLib.LinkedList;
    using LinkedListExtensionLib for LinkedListLib.LinkedList;

    //fake constants: this way they are only stored on stack until constants issue gets fixed
    //https://github.com/ethereum/solidity/issues/1290
    //we actually want to be abel to do: LinkedListLib.HEAD
    uint256 constant NULL = 0;
    uint256 constant HEAD = 0;
    bool constant PREV = false;
    bool constant NEXT = true;

    // function getIterator(LinkedListLib.LinkedList storage self) 
    // internal 
    // pure 
    // returns(LinkedListIteratorLib.Iterator) {
    //     return LinkedListIteratorLib.Iterator(HEAD, self);
    // }

    function getIterator(LinkedListLib.LinkedList storage) 
    internal 
    pure 
    returns(LinkedListIteratorLib.Iterator) {
        return LinkedListIteratorLib.Iterator(HEAD, 0);
    }

    function isHead(LinkedListLib.LinkedList storage self, uint256 node) 
    public 
    view 
    returns(bool) {
        return node == HEAD;
    }

    function getAdjacentNext(LinkedListLib.LinkedList storage self, uint256 _node) 
    public 
    view 
    returns(bool, uint256) {
        return self.getAdjacent(_node, NEXT);
    }

    // function getKeysArray(LinkedListLib.LinkedList storage self)
    // public
    // view
    // returns(uint256[]) {
    //     uint256[] memory res = new uint256[](self.sizeOf());
    //     LinkedListIteratorLib.Iterator memory iterator = self.getIterator();
        
    //     while(iterator.hasNext(self)) {
    //         res[iterator.getCounter()] = iterator.next();
    //     }

    //     return res;
    // }

    // function getKeysAddressArray(LinkedListLib.LinkedList storage self)
    // public
    // view
    // returns(address[]) {
    //     address[] memory res = new address[](self.sizeOf());
    //     LinkedListIteratorLib.Iterator memory iterator = self.getIterator();
        
    //     while(iterator.hasNext(self)) {
    //         res[iterator.getCounter()] = iterator.next().toAddress();
    //     }

    //     return res;
    // }
}