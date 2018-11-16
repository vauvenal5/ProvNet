pragma solidity ^0.4.24;

import "../../node_modules/ethereum-libraries-linked-list/contracts/LinkedListLib.sol";
import "./SwitchableRBACWithSuperuser.sol";
import "../libs/TagLib.sol";
import "../libs/LinkedList/LinkedListIteratorLib.sol";
import "../libs/LinkedList/LinkedListExtensionLib.sol";
import "../libs/AddressUtils.sol";
import "../libs/Uint256Utils.sol";
import "../libs/LinkedList/LinkedListAdvancedExtensionLib.sol";

contract UserAccessControl is SwitchableRBACWithSuperuser {
    using TagLib for TagLib.TagList;
    using LinkedListLib for LinkedListLib.LinkedList;
    using LinkedListExtensionLib for LinkedListLib.LinkedList;
    using LinkedListIteratorLib for LinkedListIteratorLib.Iterator;
    using AddressUtils for address;
    using Uint256Utils for uint256;
    using LinkedListAdvancedExtensionLib for LinkedListLib.LinkedList;

    LinkedListLib.LinkedList users;

    string constant ROLE_EDITOR = "editor";

    struct ReservedRoles {
        uint8 superUser;
        uint8 editor;
    }

    ReservedRoles roles = ReservedRoles(1,2);

    TagLib.TagList private specialRoles;

    constructor() public {
        specialRoles.addTag(roles.superUser, ROLE_SUPERUSER);
        specialRoles.addTag(roles.editor, ROLE_EDITOR);
    }

    function addUserWithSpecialRoles(address _user, uint256[] _roles)
    public
    onlyOwnerOrSuperuser() {
        addUserWithTagRoles(_user, _roles, specialRoles);
    }

    function addUserWithTagRoles(address _user, uint256[] _roles, TagLib.TagList storage _tags) 
    internal
    onlyOwnerOrSuperuser() {
        for(uint256 i = 0; i < _roles.length; i++) {
            TagLib.Tag storage tag = _tags.getTag(_roles[i]);
            addUser(_user, tag.title);
        }
    }

    function removeUserWithSpecialRoles(address _user, uint256[] _roles)
    public
    onlyOwnerOrSuperuser() {
        removeUserWithTagRoles(_user, _roles, specialRoles);
    }

    function removeUserWithTagRoles(address _user, uint256[] _roles, TagLib.TagList storage _tags)
    internal
    onlyOwnerOrSuperuser() {
        for(uint256 i = 0; i < _roles.length; i++) {
            TagLib.Tag storage tag = _tags.getTag(_roles[i]);
            SwitchableRBACWithSuperuser.removeUser(_user, tag.title);
        }
    }

    function addUser(address _user, string _role)
    public 
    onlyOwnerOrSuperuser() {
        if(!users.nodeExists(_user.toUint256())) {
            users.push(_user.toUint256(), false);
        }
        SwitchableRBACWithSuperuser.addUser(_user, _role);
    }

    function getUsers()
    public
    view
    returns(address[]) {
        return users.getKeysAddressArray();
    }

    function getSpecialRoles()
    public 
    view 
    returns(uint256[]) {
        return specialRoles.toReturnValue();
    }

    function getSpecialRole(uint256 _role)
    public
    view
    returns(uint256, string) {
        return (_role, specialRoles.getTag(_role).title);
    }

    function getRoles(address _user, TagLib.TagList storage _roles)
    internal
    view
    returns(uint256[]) {
        uint256[] memory resRoles = new uint256[](_roles.sizeOf());
        LinkedListIteratorLib.Iterator memory iterator = _roles.getIterator();

        while(iterator.hasNext(_roles.getKeyList())) {            
            resRoles[iterator.getCounter()] = 0;
            
            if(hasRole(_user, _roles.getTag(iterator.next()).title)) {
                resRoles[iterator.getCounter()] = iterator.next();
            }
        }

        return resRoles;
    }

    function getSpecialRolesForUser (address _user)
    internal
    view
    returns(uint256[]) {
        return getRoles(_user, specialRoles);
    }
}