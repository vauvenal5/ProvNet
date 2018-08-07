pragma solidity ^0.4.24;

import "../../node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "../../node_modules/openzeppelin-solidity/contracts/ownership/rbac/RBAC.sol";

import "../libs/ProvenanceLinkLibrary.sol";

contract SimpleProvenanceContract is Ownable, RBAC {
    using ProvenanceLinkLibrary for ProvenanceLinkLibrary.ProvenanceLinks;

    string constant ROLE_ADMIN = "admin";
    string constant ROLE_LINKER = "linker";
    string constant ROLE_PROV_LINKER = "prov_linker";
    string constant ROLE_EDITOR = "editor";

    mapping (string => bool) inactiveRoles;
    
    mapping (string => string) provenance;
    mapping (string => address[]) hasProvenance;

    ProvenanceLinkLibrary.ProvenanceLinks private links;
    

    modifier onlyActiveRole(string _role) {
        require(inactiveRoles[_role] || hasRole(msg.sender, _role));
        _;
    }

    function putProvenance(string _url, string _provenance) public onlyActiveRole(ROLE_EDITOR) {
        provenance[_url] = _provenance;
    }

    function getProvenance(string _url) public view returns (string) {
        return provenance[_url];
    }

    function addHasProvenanceLink(string _url, address _contract) public onlyActiveRole(ROLE_PROV_LINKER) {
        hasProvenance[_url].push(_contract);
    }

    function addTrustLink(address _contract) public {
        addLink(_contract, "trusted");
    }

    //admin basically first enables new list by creating new role :)
    function addLink(address _contract, string _type) public onlyActiveRole(_type) {
        links.addLink(_contract, _type);
    }
}