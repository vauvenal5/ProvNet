pragma solidity ^0.4.24;

library Uint256Utils {
    function toAddress(uint256 _address) internal pure returns (address) {
        return address(_address);
    }
}