pragma solidity ^0.4.24;

import "../libs/TagLib.sol";

contract TagLibMock {
    using TagLib for TagLib.TagList;

    TagLib.TagList private tagList;

    function addTag(uint256 tag, string title)
    public {
        tagList.addTag(tag, title);
    }

    function toReturnValue()
    public
    view
    returns(uint256[]) {
        return tagList.toReturnValue();
    }
}