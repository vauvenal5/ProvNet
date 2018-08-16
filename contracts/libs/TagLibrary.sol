pragma solidity ^0.4.24;

import "../../node_modules/ethereum-libraries-linked-list/contracts/LinkedListLib.sol";

library TagLibrary {
    using TagLibrary for TagLibrary.TagList;
    using LinkedListLib for LinkedListLib.LinkedList;

    struct Tag {
        uint id;
        string title;
    }

    struct TagList {
        LinkedListLib.LinkedList keys;
        mapping (uint => Tag) tags;
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

    function removeTag(TagList storage self, uint256 tag) internal 
    tagExists(self, tag) {
        self.keys.remove(tag);
        self.tags[tag] = Tag(0, "");
    }

    function hasTag(TagList storage self, uint256 tagId) internal view returns(bool) {
        return self.keys.nodeExists(tagId);
    }

    function toReturnValue(TagList storage self) public view returns(uint256[]){
        uint256[] memory tagIds = new uint256[](self.keys.sizeOf());
        uint256 HEAD = 0;
        uint256 counter = 0;

        (bool exists, uint256 node) = self.keys.getAdjacent(HEAD, false);
        while(node != HEAD) {
            tagIds[counter] = node;
            counter++;
            (exists, node) = self.keys.getAdjacent(node, false);
        }

        return tagIds;
    }
}