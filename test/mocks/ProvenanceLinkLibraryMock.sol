pragma solidity ^0.4.24;

import "../../contracts/libs/ProvenanceLinkLibrary.sol";
import "../../contracts/libs/AddressUtils.sol";

contract ProvenanceLinkLibraryMock {
    using ProvenanceLinkLibrary for ProvenanceLinkLibrary.ProvenanceLinks;
    using LinkedListLib for LinkedListLib.LinkedList;
    using AddressUtils for address;

    ProvenanceLinkLibrary.ProvenanceLinks private links;

    function getLink(address _expectedAddress) public view returns (address, string, bool) {
        ProvenanceLinkLibrary.Link storage actualLink = links.links[_expectedAddress];
        uint256 node = _expectedAddress.toUint256();

        return (actualLink.provenanceContract, actualLink.linkType, links.linkIndex.nodeExists(node));
    }

    function getListSize() public view returns (uint256) {
        return links.linkIndex.sizeOf();
    }

    function addLink(address _contract, string _type) public {
        links.addLink(_contract, _type);
    }

    function isLinkHasProvenance(address _eAddress, string _eUrl) public view returns (bool) {
        ProvenanceLinkLibrary.Link storage actualLink = links.links[_eAddress];
        return actualLink.hasProvenance[_eUrl];
    }

    function setLinkHasProvenance(address _contract, string _url, bool _hasProvenance) public {
        links.setLinkHasProvenance(_contract, _url, _hasProvenance);
    }

    function addLinkWithProvenance(address _contract, string _type, string _url) public {
        links.addLinkWithProvenance(_contract, _type, _url);
    }

    function getLinkCountForType(string _type) public view returns (uint256) {
        return links.getLinkCountForType(_type);
    }

    function getLinkCountForUrl(string _url) public view returns (uint256) {
        return links.getLinkCountForUrl(_url);
    }

    function getLinkCountForUrlAndType(string _type, string _url) public view returns (uint256) {
        return links.getLinkCountForUrlAndType(_type, _url);
    }

    function getLinkListForType(string _type) public view returns (address[]) {
        return links.getLinkListForType(_type);
    }
}