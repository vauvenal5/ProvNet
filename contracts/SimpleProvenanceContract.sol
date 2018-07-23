pragma solidity ^0.4.24;

import "../node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract SimpleProvenanceContract is Ownable {
    mapping (bytes32 => string) provenance;

    function getUrlId(string _url) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_url));
    }

    function putProvenance(string _url, string _provenance) public {
        provenance[getUrlId(_url)] = _provenance;
    }

    function getProvenance(string _url) public view returns (string) {
        return provenance[getUrlId(_url)];
    }
}