pragma solidity ^0.4.24;

import "../node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract SimpleProvenanceContract is Ownable {
    mapping (string => string) provenance;

    function putProvenance(string _url, string _provenance) public {
        provenance[_url] = _provenance;
    }

    function getProvenance(string _url) public view returns (string) {
        return provenance[_url];
    }
}