pragma solidity ^0.4.24;

import "../../node_modules/ethereum-libraries-linked-list/contracts/LinkedListLib.sol";

import "./LinkedList/LinkedListExtensionLib.sol";
import "./LinkedList/LinkedListIteratorLib.sol";
import "./LinkedList/LinkedListAdvancedExtensionLib.sol";

library TagLib {
    using TagLib for TagLib.TagList;
    using LinkedListLib for LinkedListLib.LinkedList;
    using LinkedListExtensionLib for LinkedListLib.LinkedList;
    using LinkedListIteratorLib for LinkedListIteratorLib.Iterator;
    using LinkedListAdvancedExtensionLib for LinkedListLib.LinkedList;

    struct Tag {
        uint256 id;
        string title;
    }

    struct TagList {
        LinkedListLib.LinkedList keys;
        mapping (uint256 => Tag) tags;
    }

    modifier tagExists(TagList storage self, uint256 tag) {
        require(self.keys.nodeExists(tag), "Tag does not exist!");
        _;
    }

    modifier tagDoesNotExist(TagList storage self, uint256 tag) {
        require(!self.keys.nodeExists(tag), "Tag does exist!");
        _;
    }

    function addTag(TagList storage self, Tag tag) internal {
        self.addTag(tag.id, tag.title);
    }

    function addTag(TagList storage self, uint256 tag, string title) internal 
    tagDoesNotExist(self, tag) {
        self.keys.push(tag, false);
        self.tags[tag] = Tag(tag, title);
    }

    function setTagTitle(TagList storage self, uint256 tag, string title) internal tagExists(self, tag) {
        self.tags[tag] = Tag(tag, title);
    }

    function removeTag(TagList storage self, uint256 tag) internal 
    tagExists(self, tag) {
        self.keys.remove(tag);
        self.tags[tag] = Tag(0, "");
    }

    function hasTag(TagList storage self, uint256 tagId) internal view returns(bool) {
        return self.keys.nodeExists(tagId);
    }

    function getTag(TagList storage self, uint256 tagId) internal 
    view 
    tagExists(self, tagId)
    returns(Tag) {
        return self.tags[tagId];
    }

    function sizeOf(TagList storage self) 
    public 
    view
    returns(uint256) {
        return self.keys.sizeOf();
    }

    function getIterator(TagList storage self)
    internal
    view
    returns(LinkedListIteratorLib.Iterator) {
        return self.keys.getIterator();
    }

    function getKeyList(TagList storage self)
    internal
    view
    returns (LinkedListLib.LinkedList storage) {
        return self.keys;
    }


    // function getTag(TagList storage self, uint256 tagId) public view returns(uint256, string) {
    //     return (4,"hall");
    // }

    function toReturnValue(TagList storage self) public view returns(uint256[]){
        // uint256[] memory tagIds = new uint256[](self.keys.sizeOf());
        // uint256 counter = 0;
        // LinkedListIteratorLib.Iterator memory iterator = self.keys.getIterator();
        
        // (bool hasNext, uint256 next) = iterator.getNext(self.keys);
        // while(hasNext) {
        //     tagIds[counter] = next;
        //     counter++;
        //     (hasNext, next) = iterator.getNext(self.keys);
        // }

        // return tagIds;
        return self.keys.getKeysArray();
    }
}