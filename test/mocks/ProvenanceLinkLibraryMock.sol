pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "../../contracts/ProvenanceLinkLibrary.sol";

contract ProvenanceLinkLibraryMock {
    using ProvenanceLinkLibrary for ProvenanceLinkLibrary.ProvenanceLinks;
    using LinkedListLib for LinkedListLib.LinkedList;

    ProvenanceLinkLibrary.ProvenanceLinks private links;

    function assertLink(address _expectedAddress, string _expectedType) public {
        ProvenanceLinkLibrary.Link storage actualLink = links.links[_expectedAddress];

        Assert.equal(actualLink.provenanceContract, _expectedAddress, "Contract address should be correct in link!");
        Assert.equal(actualLink.linkType, _expectedType, "Link type should be set correctly!");
        uint256 node = ProvenanceLinkLibrary.convert(_expectedAddress);
        Assert.isTrue(links.linkIndex.nodeExists(node), "Link should be indexed!");
    }

    function addLink(address _contract, string _type) public {
        links.addLink(_contract, _type);
    }

    function setLinkHasProvenance(address _contract, string _url, bool _hasProvenance) public {
        links.setLinkHasProvenance(_contract, _url, _hasProvenance);
    }
}