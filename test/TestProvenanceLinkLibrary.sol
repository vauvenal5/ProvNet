pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/mocks/ProvenanceLinkLibraryMock.sol";

contract TestProvenanceLinkLibrary {
    address actualEthAddress = address(0x126bF276bA4C7111dbddbb542718CfF678C9b3Ce);
    string url = "https://github.com/vauvenal5/ProvNet/commit/d463c219812aa8a4328abc1053afdbcc93317657";
    string testType = "test";

    function assertLink(ProvenanceLinkLibraryMock mock, address _expectedAddress, string _expectedType) private {
        (address actualAddress, string memory actualType, bool indexExists) = mock.getLink(_expectedAddress);
        uint256 listSize = mock.getListSize();

        Assert.equal(actualAddress, _expectedAddress, "Contract address should be correct in link!");
        Assert.equal(actualType, _expectedType, "Link type should be set correctly!");
        Assert.isTrue(indexExists, "Link should be indexed!");
        Assert.equal(listSize, 1, "Expected list size incorrect!");
    }

    function testAddLink() public {
        ProvenanceLinkLibraryMock mock = new ProvenanceLinkLibraryMock();

        mock.addLink(actualEthAddress, testType);
        
        assertLink(mock, actualEthAddress, testType);
    }

    function testSetLinkHasProvenance() public {
        ProvenanceLinkLibraryMock mock = new ProvenanceLinkLibraryMock();
        mock.addLink(actualEthAddress, testType);
        
        assertLink(mock, actualEthAddress, testType);
        
        mock.setLinkHasProvenance(actualEthAddress, url, true);

        Assert.isTrue(mock.isLinkHasProvenance(actualEthAddress, url), "Has provenance should be set!");

        mock.setLinkHasProvenance(actualEthAddress, url, false);

        Assert.isFalse(mock.isLinkHasProvenance(actualEthAddress, url), "Has provenance should be cleared!");
    }

    /*function testaddLinkWithProvenance() public {
        ProvenanceLinkLibrary.ProvenanceLinks storage links;
        links.addLinkWithProvenance(actualEthAddress, testType, url);
    }*/
}