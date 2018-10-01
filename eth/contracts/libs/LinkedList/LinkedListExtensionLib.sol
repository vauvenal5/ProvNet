pragma solidity ^0.4.24;

import "../../../node_modules/ethereum-libraries-linked-list/contracts/LinkedListLib.sol";

import "./LinkedListIteratorLib.sol";

library LinkedListExtensionLib {
    using LinkedListLib for LinkedListLib.LinkedList;

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
        return LinkedListIteratorLib.Iterator(HEAD);
    }

    function isHead(LinkedListLib.LinkedList storage, uint256 node) 
    public 
    pure 
    returns(bool) {
        return node == HEAD;
    }

    function getAdjacentNext(LinkedListLib.LinkedList storage self, uint256 _node) 
    public 
    view 
    returns(bool, uint256) {
        return self.getAdjacent(_node, NEXT);
    }
}