pragma solidity ^0.4.24;

import "../../node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "../../node_modules/openzeppelin-solidity/contracts/ownership/Superuser.sol";
import "../../node_modules/openzeppelin-solidity/contracts/ownership/rbac/RBAC.sol";

import "../libs/StringUtils.sol";

contract SwitchableRBACWithSuperuser is Superuser {
    using StringUtils for string;

    mapping (string => bool) inactiveRoles;
    
    modifier onlyActiveRole(string _role) {
        require(inactiveRoles[_role] || hasRole(msg.sender, _role), "Role has to be inactive or user has to have role!");
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
        inactiveRoles[_role] = true;
    }

    function setRoleClosed(string _role) public onlyOwnerOrSuperuser() roleIsNotSuperuser(_role) {
        inactiveRoles[_role] = false;
    }
}