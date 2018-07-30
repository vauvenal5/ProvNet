pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/ProvenanceLinkLibrary.sol";

contract TestProvenanceLinkLibrary {
    //using ProvenanceLinkLibrary for ProvenanceLinkLibrary.ProvenanceLinks;

    ProvenanceLinkLibrary.ProvenanceLinks private links;
    
    function testConvertFromAddressToUint256() public {
        address expected = address(0x126bF276bA4C7111dbddbb542718CfF678C9b3Ce);
        uint256 res = ProvenanceLinkLibrary.convert(expected);
        address actual = ProvenanceLinkLibrary.convert(res);

        Assert.equal(actual, expected, "Address cnversion should be correct!");
    }
}