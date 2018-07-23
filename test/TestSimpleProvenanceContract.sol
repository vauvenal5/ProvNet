pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/SimpleProvenanceContract.sol";

contract TestSimpleProvenanceContract is SimpleProvenanceContract {

    string url = "https://github.com/vauvenal5/ProvNet/commit/d463c219812aa8a4328abc1053afdbcc93317657";
    bytes32 urlHash = 0xd28040c0cf935fd2bf7f3700f24656857ca2ca01655b6af5808aacbd3003c55f;
    string prov = "this is some random text since we have no prov content check yet";

    function beforeEach() public {
        provenance[urlHash] = "";
    }

    function testGetUrlId() public {
        Assert.equal(getUrlId(url), urlHash, "URL hash should be calculated correctly.");
    }

    function testPutProvenance() public {
        putProvenance(url, prov);
        Assert.equal(provenance[urlHash], prov, "Provenance should be set correctly!");
    }

    function testGetProvenance() public {
        provenance[urlHash] = prov;
        string memory actual = getProvenance(url);
        Assert.equal(actual, prov, "Returned provenance should match!");
    }
}