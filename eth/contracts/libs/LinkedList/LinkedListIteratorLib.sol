pragma solidity ^0.4.24;

import "../../../node_modules/ethereum-libraries-linked-list/contracts/LinkedListLib.sol";

import "./LinkedListExtensionLib.sol";

library LinkedListIteratorLib {
    using LinkedListLib for LinkedListLib.LinkedList;
    using LinkedListExtensionLib for LinkedListLib.LinkedList;

    //This is how it should look at some point + the getIterator function in LinkedListExtensionLib
    //see issue https://github.com/ethereum/solidity/issues/1010
    // struct Iterator {
    //     uint256 pointer;
    //     LinkedListLib.LinkedList list;
    // }
    //
    // function getNext(LinkedListIteratorLib.Iterator memory self) 
    // internal 
    // view 
    // returns(bool)
    //
    // function next(LinkedListIteratorLib.Iterator storage self) 
    // public  
    // returns(uint256)

    struct Iterator {
        uint256 pointer;
    }

    function getNext(LinkedListIteratorLib.Iterator memory self, LinkedListLib.LinkedList storage list) 
    internal 
    view 
    returns(bool, uint256) {        
        (bool pointerExists, uint256 next) = list.getAdjacentNext(self.pointer);

        if(!pointerExists || list.isHead(next)) {
            return (false, 0);
        }

        if(list.nodeExists(next)) {
            self.pointer = next;
            return (true, next);
        }

        return (false, 0);
    }
}