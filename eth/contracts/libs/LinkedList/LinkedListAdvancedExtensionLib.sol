pragma solidity ^0.4.24;

import "../../../node_modules/ethereum-libraries-linked-list/contracts/LinkedListLib.sol";

import "./LinkedListIteratorLib.sol";
import "./LinkedListExtensionLib.sol";
import "../Uint256Utils.sol";

/**
    We need and ExtensionLib and an AdvancedExtensionLib because the IteratorLib builds upon the ExtensionLib and the AdvancedExtension needs the IteratorLib. Moving this function into ExtensionLib would lead to a cyclic dependency between ExtensionLib and IteratorLib.
*/
library LinkedListAdvancedExtensionLib {
    using LinkedListLib for LinkedListLib.LinkedList;
    using LinkedListExtensionLib for LinkedListLib.LinkedList;
    using LinkedListIteratorLib for LinkedListIteratorLib.Iterator;
    using Uint256Utils for uint256;

    function getKeysArray(LinkedListLib.LinkedList storage self)
    public
    view
    returns(uint256[] memory) {
        uint256[] memory res = new uint256[](self.sizeOf());
        LinkedListIteratorLib.Iterator memory iterator = self.getIterator();
        
        while(iterator.hasNext(self)) {
            res[iterator.getCounter()] = iterator.next();
        }

        return res;
    }

    function getKeysAddressArray(LinkedListLib.LinkedList storage self)
    public
    view
    returns(address[] memory) {
        address[] memory res = new address[](self.sizeOf());
        LinkedListIteratorLib.Iterator memory iterator = self.getIterator();
        
        while(iterator.hasNext(self)) {
            res[iterator.getCounter()] = iterator.next().toAddress();
        }

        return res;
    }
}