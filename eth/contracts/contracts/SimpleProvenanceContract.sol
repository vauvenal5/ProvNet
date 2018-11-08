pragma solidity ^0.4.24;

import "../libs/StringUtils.sol";
import "../libs/ProvLink/ProvLinkLib.sol";
import "../libs/ProvLink/ProvLinkListLib.sol";
import "../libs/TagLib.sol";

import "./SwitchableRBACWithSuperuser.sol";
import "./LinkableContract.sol";
import "./UserAccessControl.sol";

contract SimpleProvenanceContract is LinkableContract {
    
    mapping (string => string) provenance;

    string private description;
    string private logoUrl;
    string private title = "defaultTitle";

    /**
        Other stuff
    */

    function getDescription()
    public
    view
    returns (string) {
        return description;
    }

    function setDescription(string _description)
    public 
    onlyOwnerOrSuperuser() {
        description = _description;
    }

    function getLogoUrl()
    public
    view
    returns (string) {
        return logoUrl;
    }

    function setLogoUrl(string _logoUrl)
    public 
    onlyOwnerOrSuperuser() {
        logoUrl = _logoUrl;
    }

    function getTitle()
    public
    view
    returns (string) {
        return title;
    }

    function setTitle(string _title)
    public 
    onlyOwnerOrSuperuser() {
        title = _title;
    }

    /**
        Users
    */

    function getUser(address _user)
    public
    view
    returns(address, uint256[], uint256[], bool) {
        return (_user, getSpecialRolesForUser(_user), getLinkRolesForUser(_user), isOwner(_user));
    }


    /**
        Provenance
    */

    function putProvenance(string _url, string _provenance) public onlyRoleOrOpenRole(ROLE_EDITOR) {
        provenance[_url] = _provenance;
    }

    function getProvenance(string _url) public view returns (string) {
        return provenance[_url];
    }
}