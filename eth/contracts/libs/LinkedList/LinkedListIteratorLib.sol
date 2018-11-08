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
        //todo-sv: note: it is not possible to reference mappings in memory because memory is differently organised then storage
        //see: https://ethereum.stackexchange.com/questions/36365/member-x-is-not-available-in-struct-y-memory-outside-of-storage
        uint256 pointer;
        uint256 counter;
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

    /**
        This function returns a zero based index of the iterator, showing how many elements have been iterated over.
    */
    function getCounter(LinkedListIteratorLib.Iterator memory self)
    internal
    view
    returns(uint256) {
        return self.counter-1;
    }

    function next(LinkedListIteratorLib.Iterator memory self) 
    internal 
    view 
    returns(uint256) {
        return self.pointer;
    }

    function hasNext(LinkedListIteratorLib.Iterator memory self, LinkedListLib.LinkedList storage list) 
    internal 
    view 
    returns(bool) {        
        (bool pointerExists, uint256 next) = list.getAdjacentNext(self.pointer);

        if(!pointerExists || list.isHead(next)) {
            return false;
        }

        if(list.nodeExists(next)) {
            self.counter++;
            self.pointer = next;
            return true;
        }

        return false;
    }
}