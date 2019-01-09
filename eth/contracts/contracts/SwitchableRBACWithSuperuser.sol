pragma solidity ^0.4.24;

import "../../node_modules/openzeppelin-solidity/contracts/ownership/Superuser.sol";

import "../libs/StringUtils.sol";

contract SwitchableRBACWithSuperuser is Superuser {
    using StringUtils for string;

    mapping (string => bool) openRoles;
    
    modifier onlyRoleOrOpenRole(string _role) {
        require(openRoles[_role] || hasRole(msg.sender, _role), "Role has to be inactive or user has to have role!");
        _;
    }

    modifier roleIsNotSuperuser(string _role) {
        require(!ROLE_SUPERUSER.equalHashWithLengthCheck(_role), "Parameter is not allowed to be superuser!");
        _;
    }

    function addUser(address _user, string _role) public onlyOwnerOrSuperuser() {
        addRole(_user, _role);
    }

    function removeUser(address _user, string _role) public onlyOwnerOrSuperuser() {
        removeRole(_user, _role);
    }

    function setRoleOpen(string _role) public onlyOwnerOrSuperuser() roleIsNotSuperuser(_role) {
        openRoles[_role] = true;
    }

    function setRoleClosed(string _role) public onlyOwnerOrSuperuser() roleIsNotSuperuser(_role) {
        openRoles[_role] = false;
    }

    function isOwner(address _address) public view returns(bool) {
        return owner == _address;
    }

    function isRoleOpen(string _role) public view returns(bool) {
        return openRoles[_role];
    }
}