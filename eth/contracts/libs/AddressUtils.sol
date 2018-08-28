pragma solidity ^0.4.24;

library AddressUtils {
    function toUint256(address _address) internal pure returns (uint256) {
        return uint256(_address);
    }
}