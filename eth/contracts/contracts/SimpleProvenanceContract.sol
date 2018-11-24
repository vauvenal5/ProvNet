pragma solidity ^0.4.24;

import "../libs/StringUtils.sol";
import "../libs/ProvLink/ProvLinkLib.sol";
import "../libs/ProvLink/ProvLinkListLib.sol";
import "../libs/TagLib.sol";
import "../libs/UrlLib.sol";

import "./SwitchableRBACWithSuperuser.sol";
import "./LinkableContract.sol";
import "./UserAccessControl.sol";

contract SimpleProvenanceContract is LinkableContract {
    using UrlLib for UrlLib.UrlList;
    using LinkedListLib for LinkedListLib.LinkedList;
    using LinkedListExtensionLib for LinkedListLib.LinkedList;
    using LinkedListIteratorLib for LinkedListIteratorLib.Iterator;
    //for now we do not need a list here since to provenance is write once however when/if we implement provenance migration between contracts we may need to extend this to a list that allows for easy removal; consider also that this list should be write optimized in regard of the check if a url exists
    //uint256 keyIndex = 0;
    //mapping (uint256 => string) urls;

    UrlLib.UrlList private urls;
    mapping (string => string[]) provenance;

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

    function putProvenanceRecord(string _url, string _provenance) public onlyRoleOrOpenRole(ROLE_EDITOR) {
        if(!urls.hasUrl(_url)) {
            urls.add(_url);
        }

        string[] storage provArray = provenance[_url];
        provArray.push(_provenance);
    }

    function getProvenanceRecordLength(string _url) public view returns (uint256) {
        return provenance[_url].length;
    }

    function getProvenanceRecord(string _url, uint256 _index) public view returns (string) {
        return provenance[_url][_index];
    }
}