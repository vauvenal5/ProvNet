pragma solidity ^0.4.24;

import "../libs/StringUtils.sol";
import "../libs/ProvLink/ProvLinkLib.sol";
import "../libs/TagLib.sol";

import "./SwitchableRBACWithSuperuser.sol";

contract SimpleProvenanceContract is SwitchableRBACWithSuperuser {
    using ProvLinkLib for ProvLinkLib.LinkList;
    using StringUtils for string;
    using TagLib for TagLib.TagList;

    struct ReservedTags {
        uint8 trusted;
        uint8 known;
        uint8 pingback;
    }

    ReservedTags tags = ReservedTags(1,2,3);

    //string constant ROLE_LINKER = "linker";
    //string constant ROLE_PROV_LINKER = "prov_linker";
    string constant ROLE_EDITOR = "editor";
    
    mapping (string => string) provenance;

    string private description;
    string private logoUrl;

    ProvLinkLib.LinkList private links;
    TagLib.TagList private linkTypes;

    constructor() public {
        //todo-sv: how to handle default tags?
        //--> fix them?
        //--> introduce reserved tag slots?
        linkTypes.addTag(tags.trusted, "trusted");
        linkTypes.addTag(tags.known, "known");
        linkTypes.addTag(tags.pingback, "pingback");
    }

    modifier notReserved(uint256 _type) {
        require(!linkTypes.hasTag(_type), "Link type exists allready.");
        _;
    }

    modifier isPingbackable(address _contract) {
        ProvLinkLib.Link storage link = links.getLink(_contract);
        require(link.types[tags.pingback], "Link is not open for pingbacks!");
        _;
    }

    modifier validLinkType(uint256 _type) {
        require(linkTypes.hasTag(_type), "Link type does not exist on this contract.");
        _;
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

    /**
        Provenance
    */

    function putProvenance(string _url, string _provenance) public onlyRoleOrOpenRole(ROLE_EDITOR) {
        provenance[_url] = _provenance;
    }

    function getProvenance(string _url) public view returns (string) {
        return provenance[_url];
    }

    /**
        Links 
    */

    //todo-sv: who is allowed to set that a link has provenance?
    //--> whoever is allowed to add the link in first place?
    //--> Do we need a has provenance role?
    function addPingback(string _url, address _contract) 
    public 
    isPingbackable(_contract) {
        links.setLinkHasProvenance(_contract, _url, true);
    }

    function setHasProvenanceLink(string _url, address _contract, bool hasProv, uint256 _type) 
    public 
    validLinkType(_type) 
    onlyRoleOrOpenRole(linkTypes.getTag(_type).title) {
        links.setLinkHasProvenance(_contract, _url, hasProv);
    }

    //admin basically first enables new list by creating new role :)
    function addLink(address _contract, uint256 _type) 
    public 
    validLinkType(_type) 
    onlyRoleOrOpenRole(linkTypes.getTag(_type).title) {
        links.addLink(_contract, _type);
    }

    /**
        Tags
    */

    function addLinkType(uint256 _type, string title)
    public
    notReserved(_type)
    onlyOwnerOrSuperuser() {
        linkTypes.addTag(_type, title);
    }

    function getLinkType(uint256 _type)
    public 
    view
    returns(string) {
        return linkTypes.getTag(_type).title;
    }

    function getLinkTypes()
    public
    view
    returns(uint256[]) {
        return linkTypes.toReturnValue();
    }
}