pragma solidity ^0.4.24;

import "../libs/StringUtils.sol";
import "../libs/ProvLink/ProvLinkLib.sol";
import "../libs/ProvLink/ProvLinkListLib.sol";
import "../libs/TagLib.sol";

import "./UserAccessControl.sol";

contract LinkableContract is UserAccessControl {
    using ProvLinkLib for ProvLinkLib.Link;
    using ProvLinkListLib for ProvLinkListLib.LinkList;
    using StringUtils for string;
    using TagLib for TagLib.TagList;

    struct ReservedTags {
        uint8 trusted;
        uint8 known;
        uint8 pingback;
        uint8 linkback;
    }

    ReservedTags internal tags = ReservedTags(1,2,3,4);

    ProvLinkListLib.LinkList private links;
    TagLib.TagList private linkTypes;

    constructor() public {
        //todo-sv: how to handle default tags?
        //--> fix them?
        //--> introduce reserved tag slots?
        linkTypes.addTag(tags.trusted, "trusted");
        linkTypes.addTag(tags.known, "known");
        linkTypes.addTag(tags.pingback, "pingback");
        linkTypes.addTag(tags.linkback, "linkback");
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
        Users
    */

    function changeUser(address _user, uint256[] special, uint256[] removedSpecial, uint256[] link, uint256[] removedLink) 
    public 
    onlyOwnerOrSuperuser() {
        UserAccessControl.addUserWithTagRoles(_user, link, linkTypes);
        UserAccessControl.addUserWithSpecialRoles(_user, special);
        UserAccessControl.removeUserWithTagRoles(_user, removedLink, linkTypes);
        UserAccessControl.removeUserWithSpecialRoles(_user, removedSpecial);
    }

    function getLinkRolesForUser(address _user) 
    internal
    view
    returns(uint256[]) {
        return getRoles(_user, linkTypes);
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
        LinkableContract linked = LinkableContract(_contract);
        if(linked.isRoleOpen(getLinkType(tags.linkback))) {
            linked.addHardLink(this, tags.linkback);
        }
    }

    /**
        This function has alos the purpose to allow future proof linking.
        If the contracts change a lot in future iterations this is a way to link contracts even if they are not linkable any more by addLink standards.
     */
    function addHardLink(address _contract, uint256 _type) 
    public 
    validLinkType(_type) 
    onlyRoleOrOpenRole(linkTypes.getTag(_type).title) {
        links.addLink(_contract, _type);
    }

    function getLinkList()
    public
    view
    returns(address[]) {
        return links.toReturnValue();
    }

    function getLink(address link)
    public
    view
    returns(address, uint256[]) {
        return links.getLink(link).toReturnValue(linkTypes);
    }

    /**
        Tags
    */

    function addLinkType(uint256 _type, string title)
    public
    notReserved(_type)
    //todo-sv: not existing check!!!
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

    function setTagTitle(uint256 _type, string _title)
    public
    onlyOwnerOrSuperuser() {
        linkTypes.setTagTitle(_type, _title);
    }
}