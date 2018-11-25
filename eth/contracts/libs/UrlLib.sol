pragma solidity ^0.4.24;

import "../../node_modules/ethereum-libraries-linked-list/contracts/LinkedListLib.sol";
import "./LinkedList/LinkedListAdvancedExtensionLib.sol";

library UrlLib {
    using UrlLib for UrlLib.UrlList;
    using LinkedListLib for LinkedListLib.LinkedList;
    using LinkedListAdvancedExtensionLib for LinkedListLib.LinkedList;

    event UrlAdded(uint256 key, string url);
    //todo-sv: compare this list library to the tagLis library and think of refactoring tag list into the same way... 
    
    // struct Url {
    //     uint256 id;
    //     string url;
    // }

    /** 
    This rather complicated list structure allows for iterating over existing urls in views without the need to iterate when checking for existence or when creating a new entry.
    */
    struct UrlList {
        LinkedListLib.LinkedList keys;
        //mapping (uint256 => Url) urls;
        mapping (uint256 => string) urls;
        mapping (string => uint256) keyMap;
        uint256 keyCount;
    }

    function add(UrlList storage self, string _url) internal {
        self.keyCount++;
        self.keys.push(self.keyCount, false);
        self.urls[self.keyCount] = _url;
        self.keyMap[_url] = self.keyCount;
        emit UrlAdded(self.keyCount, _url);
    }

    function hasUrl(UrlList storage self, string _url) internal view returns(bool) {
        if(self.keyMap[_url] == 0) {
            return false;
        }
        return true;
        //return self.keys.nodeExists(self.keyMap[_url]);
    }

    function getUrl(UrlList storage self, uint256 _key) internal view returns (string storage) {
        return self.urls[_key];
    }

    function toReturnValue(UrlList storage self) public view returns(uint256[]){
        return self.keys.getKeysArray();
    }
}