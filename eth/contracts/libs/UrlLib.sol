pragma solidity ^0.4.24;

import "../../node_modules/ethereum-libraries-linked-list/contracts/LinkedListLib.sol";

import "./LinkedList/LinkedListExtensionLib.sol";
import "./LinkedList/LinkedListIteratorLib.sol";
import "./LinkedList/LinkedListAdvancedExtensionLib.sol";

library UrlLib {
    using UrlLib for UrlLib.UrlList;
    using LinkedListLib for LinkedListLib.LinkedList;
    using LinkedListExtensionLib for LinkedListLib.LinkedList;
    using LinkedListIteratorLib for LinkedListIteratorLib.Iterator;
    using LinkedListAdvancedExtensionLib for LinkedListLib.LinkedList;

    struct Url {
        uint256 id;
        string url;
    }

    struct UrlList {
        LinkedListLib.LinkedList keys;
        mapping (string => Url) urls;
        uint256 keyCount;
    }

    function add(UrlList storage self, string _url) internal {
        self.keyCount++;
        self.keys.push(self.keyCount, false);
        self.urls[_url] = Url(self.keyCount, _url);
    }

    function hasUrl(UrlList storage self, string _url) internal view returns(bool) {
        return self.keys.nodeExists(self.urls[_url].id);
    }

    function getUrl(UrlList storage self, uint256 key) internal view returns (Url storage) {
        //how to best map key to url?
    }

    function toReturnValue(UrlList storage self) public view returns(uint256[]){
        return self.keys.getKeysArray();
    }
}