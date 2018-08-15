pragma solidity ^0.4.24;

import "../contracts/SwitchableRBACWithSuperuser.sol";

contract SwitchableRBACWithSuperuserMock is SwitchableRBACWithSuperuser{
    function onlyByRoleOrOpenRole(string _role) public
    view 
    onlyRoleOrOpenRole(_role) 
    returns(bool) {
        return true;
    }
}