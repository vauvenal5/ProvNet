pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/contracts/SimpleProvenanceContract.sol";

contract TestSimpleProvenanceContract is SimpleProvenanceContract {

    string url = "https://github.com/vauvenal5/ProvNet/commit/d463c219812aa8a4328abc1053afdbcc93317657";
    string prov = "this is some random text since we have no prov content check yet";

    function beforeEach() public {
        provenance[url] = "";
    }

    function testPutProvenance() public {
        inactiveRoles[ROLE_EDITOR] = true;
        putProvenance(url, prov);
        Assert.equal(provenance[url], prov, "Provenance should be set correctly!");
    }

    function testGetProvenance() public {
        provenance[url] = prov;
        string memory actual = getProvenance(url);
        Assert.equal(actual, prov, "Returned provenance should match!");
    }

    function testAddLink() public {
        inactiveRoles["tested"] = true;
        addLink(this, "tested");
    }
}