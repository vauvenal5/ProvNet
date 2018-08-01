pragma solidity ^0.4.24;

import "../ProvenanceLinkLibrary.sol";

contract ProvenanceLinkLibraryMock {
    using ProvenanceLinkLibrary for ProvenanceLinkLibrary.ProvenanceLinks;
    using LinkedListLib for LinkedListLib.LinkedList;

    ProvenanceLinkLibrary.ProvenanceLinks private links;

    function getLink(address _expectedAddress) public view returns (address, string, bool, uint256) {
        ProvenanceLinkLibrary.Link storage actualLink = links.links[_expectedAddress];
        uint256 node = ProvenanceLinkLibrary.convert(_expectedAddress);

        return (actualLink.provenanceContract, actualLink.linkType, links.linkIndex.nodeExists(node), links.linkIndex.sizeOf());
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
}