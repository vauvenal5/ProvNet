pragma solidity ^0.4.24;

import "../libs/StringUtils.sol";

import "../libs/ProvenanceLinkLibrary.sol";

import "./SwitchableRBACWithSuperuser.sol";

contract SimpleProvenanceContract is SwitchableRBACWithSuperuser {
    using ProvenanceLinkLibrary for ProvenanceLinkLibrary.LinkList;
    using StringUtils for string;

    string constant ROLE_LINKER = "linker";
    string constant ROLE_PROV_LINKER = "prov_linker";
    string constant ROLE_EDITOR = "editor";
    
    mapping (string => string) provenance;

    ProvenanceLinkLibrary.LinkList private links;

    function putProvenance(string _url, string _provenance) public onlyRoleOrOpenRole(ROLE_EDITOR) {
        provenance[_url] = _provenance;
    }

    function getProvenance(string _url) public view returns (string) {
        return provenance[_url];
    }

    function addHasProvenanceLink(string _url, address _contract) public onlyRoleOrOpenRole(ROLE_PROV_LINKER) {
        links.setLinkHasProvenance(_contract, _url, true);
    }

    //todo-sv: should every contract contain a trusted list?
    /*function addTrustLink(address _contract) public {
        addLink(_contract, 1);
    }

    //admin basically first enables new list by creating new role :)
    function addLink(address _contract, uint256 _type) public onlyRoleOrOpenRole(_type) {
        links.addLink(_contract, _type);
    }*/
}