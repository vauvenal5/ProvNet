pragma solidity ^0.4.24;

import "../libs/ProvenanceLinkLibrary.sol";
import "../libs/AddressUtils.sol";
import "../libs/ProvenanceLinkQueryLibrary.sol";
import "../libs/TagLibrary.sol";

contract ProvenanceLinkLibraryMock {
    using ProvenanceLinkLibrary for ProvenanceLinkLibrary.LinkList;
    using ProvenanceLinkQueryLibrary for ProvenanceLinkLibrary.LinkList;
    using TagLibrary for TagLibrary.TagList;
    using LinkedListLib for LinkedListLib.LinkedList;
    using AddressUtils for address;

    ProvenanceLinkLibrary.LinkList private links;

    function getLink(address _expectedAddress) public view returns (address, uint256[], bool) {
        ProvenanceLinkLibrary.Link storage actualLink = links.links[_expectedAddress];
        uint256 node = _expectedAddress.toUint256();
        uint256[] memory typeIds = actualLink.types.toReturnValue();

        return (actualLink.provenanceContract, typeIds, links.linkIndex.nodeExists(node));
    }

    function getListSize() public view returns (uint256) {
        return links.linkIndex.sizeOf();
    }

    //todo-sv: this has to be improved at some point
    function addLink(address _contract, uint256 _type) public {
        links.addLink(_contract, TagLibrary.Tag(_type, "test"));
    }

    // function addLink(address _contract, uint256 _type, string _typeName) internal {
    //     links.addLink(_contract, TagLibrary.Tag(_type, _typeName));
    // }

    function isLinkHasProvenance(address _eAddress, string _eUrl) public view returns (bool) {
        ProvenanceLinkLibrary.Link storage actualLink = links.links[_eAddress];
        return actualLink.hasProvenance[_eUrl];
    }

    function setLinkHasProvenance(address _contract, string _url, bool _hasProvenance) public {
        links.setLinkHasProvenance(_contract, _url, _hasProvenance);
    }

    function addLinkWithProvenance(address _contract, uint256 _type, string _url) public {
        links.addLinkWithProvenance(_contract, TagLibrary.Tag(_type, "test"), _url);
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