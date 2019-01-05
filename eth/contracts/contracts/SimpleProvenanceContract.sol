pragma solidity ^0.4.24;

import "../libs/UrlLib.sol";

import "./LinkableContract.sol";

contract SimpleProvenanceContract is LinkableContract {
    using UrlLib for UrlLib.UrlList;
    
    //todo-sv: a url is nothing else then a tag for provenance?
    // so if we refactor the tagList we should be able to reuse it here
    // only difference would be that "normal" tags are a n-m mapping --> n tags map to m links for example
    // and in this case we have simply a 1-1 mapping --> one url(tag) maps to one set of provenance
    UrlLib.UrlList private urls;
    mapping (string => string[]) provenance;

    string private description;
    string private logoUrl;
    string private title = "defaultTitle";

    constructor(string _title) public {
        title = _title;
    }

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

    function getUrls() public view returns (uint256[]) {
        return urls.toReturnValue();
    }

    function getUrl(uint256 _key) public view returns (uint256, string) {
        return (_key, urls.getUrl(_key));
    }

    function putProvenanceRecord(string _url, string _provenance) public onlyRoleOrOpenRole(ROLE_EDITOR) {
        if(!urls.hasUrl(_url)) {
            urls.add(_url);
        }

        string[] storage provArray = provenance[_url];
        provArray.push(_provenance);
    }

    function getProvenanceRecords(string _url) public view returns (uint256) {
        return provenance[_url].length;
    }

    function getProvenanceRecord(string _url, uint256 _index) public view returns (string) {
        return provenance[_url][_index];
    }
}