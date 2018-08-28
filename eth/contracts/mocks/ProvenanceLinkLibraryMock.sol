pragma solidity ^0.4.24;

import "../libs/ProvLink/ProvLinkLib.sol";
import "../libs/AddressUtils.sol";
import "../libs/ProvLink/ProvLinkQueryLib.sol";
import "../libs/TagLib.sol";

contract ProvenanceLinkLibraryMock {
    using ProvLinkLib for ProvLinkLib.LinkList;
    using ProvLinkQueryLib for ProvLinkLib.LinkList;
    using TagLib for TagLib.TagList;
    using LinkedListLib for LinkedListLib.LinkedList;
    using AddressUtils for address;

    ProvLinkLib.LinkList private links;

    function getLink(address _expectedAddress, uint256[] types) public view returns (address, bool[], bool) {
        ProvLinkLib.Link storage actualLink = links.links[_expectedAddress];
        uint256 node = _expectedAddress.toUint256();
        bool[] memory tagValues = new bool[](types.length);
        
        for(uint256 i = 0; i < types.length;i ++) {
            tagValues[i] = actualLink.types[types[i]];
        }

        return (actualLink.provenanceContract, tagValues, links.linkIndex.nodeExists(node));
    }

    function getListSize() public view returns (uint256) {
        return links.linkIndex.sizeOf();
    }

    //todo-sv: this has to be improved at some point
    function addLink(address _contract, uint256 _type) public {
        links.addLink(_contract, _type);
    }

    // function addLink(address _contract, uint256 _type, string _typeName) internal {
    //     links.addLink(_contract, TagLib.Tag(_type, _typeName));
    // }

    function isLinkHasProvenance(address _eAddress, string _eUrl) public view returns (bool) {
        ProvLinkLib.Link storage actualLink = links.links[_eAddress];
        return actualLink.hasProvenance[_eUrl];
    }

    function setLinkHasProvenance(address _contract, string _url, bool _hasProvenance) public {
        links.setLinkHasProvenance(_contract, _url, _hasProvenance);
    }

    function addLinkWithProvenance(address _contract, uint256 _type, string _url) public {
        links.addLink(_contract, _type, _url);
    }

    function getLinkCountForType(uint256 _type) public view returns (uint256) {
        return links.getLinkCountForType(_type);
    }

    function getLinkCountForUrl(string _url) public view returns (uint256) {
        return links.getLinkCountForUrl(_url);
    }

    function getLinkCountForUrlAndType(uint256 _type, string _url) public view returns (uint256) {
        return links.getLinkCountForUrlAndType(_type, _url);
    }

    function getLinkListForType(uint256 _type) public view returns (address[]) {
        return links.getLinkListForType(_type);
    }
}