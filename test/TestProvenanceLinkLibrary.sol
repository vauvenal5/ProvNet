pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/ProvenanceLinkLibrary.sol";
import "../node_modules/ethereum-libraries-linked-list/contracts/LinkedListLib.sol";
import "./mocks/ProvenanceLinkLibraryMock.sol";

contract TestProvenanceLinkLibrary {
    using ProvenanceLinkLibrary for ProvenanceLinkLibrary.ProvenanceLinks;
    using LinkedListLib for LinkedListLib.LinkedList;

    address actualEthAddress = address(0x126bF276bA4C7111dbddbb542718CfF678C9b3Ce);
    string url = "https://github.com/vauvenal5/ProvNet/commit/d463c219812aa8a4328abc1053afdbcc93317657";
    string testType = "test";

    //ProvenanceLinkLibraryMock mock;

    /*function beforeEach() public {
        mock = ProvenanceLinkLibraryMock(DeployedAddresses.ProvenanceLinkLibraryMock());
    }*/
    
    /*function testConvertFromAddressToUint256() public {
        uint256 res = ProvenanceLinkLibrary.convert(actualEthAddress);
        address actual = ProvenanceLinkLibrary.convert(res);

        Assert.equal(actual, actualEthAddress, "Address cnversion should be correct!");
    }*/

    /*function assertLink(ProvenanceLinkLibrary.ProvenanceLinks storage links, address _expectedAddress, string _expectedType) private {
        ProvenanceLinkLibrary.Link storage actualLink = links.links[_expectedAddress];

        Assert.equal(actualLink.provenanceContract, _expectedAddress, "Contract address should be correct in link!");
        Assert.equal(actualLink.linkType, _expectedType, "Link type should be set correctly!");
        uint256 node = ProvenanceLinkLibrary.convert(_expectedAddress);
        Assert.isTrue(links.linkIndex.nodeExists(node), "Link should be indexed!");
    }*/

    function testAddLink() public {
        ProvenanceLinkLibraryMock mock = new ProvenanceLinkLibraryMock();

        mock.addLink(actualEthAddress, testType);
        
        mock.assertLink(actualEthAddress, testType);

        /*ProvenanceLinkLibrary.Link storage actualLink = links.links[actualEthAddress];

        Assert.equal(actualLink.provenanceContract, actualEthAddress, "Contract address should be correct in link!");
        Assert.equal(actualLink.linkType, testType, "Link type should be set correctly!");
        uint256 node = ProvenanceLinkLibrary.convert(actualEthAddress);
        Assert.isTrue(links.linkIndex.nodeExists(node), "Link should be indexed!");*/
    }

    function testSetLinkHasProvenance() public {
        ProvenanceLinkLibraryMock mock = new ProvenanceLinkLibraryMock();
        mock.addLink(actualEthAddress, testType);
        
        mock.assertLink(actualEthAddress, testType);
        
        mock.setLinkHasProvenance(actualEthAddress, url, true);

        /*ProvenanceLinkLibrary.Link storage actualLink = mock.links().links[actualEthAddress];

        Assert.isTrue(actualLink.hasProvenance[url], "Has provenance should be set!");

        mock.setLinkHasProvenance(actualEthAddress, url, false);

        Assert.isFalse(actualLink.hasProvenance[url], "Has provenance should be cleared!");*/
    }

    /*function testaddLinkWithProvenance() public {
        ProvenanceLinkLibrary.ProvenanceLinks storage links;
        links.addLinkWithProvenance(actualEthAddress, testType, url);
    }*/
}