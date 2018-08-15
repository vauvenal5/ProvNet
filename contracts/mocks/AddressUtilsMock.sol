pragma solidity ^0.4.24;

import "../libs/AddressUtils.sol";

contract AddressUtilsMock {
    using AddressUtils for address;

    function convert(address _a) public pure returns (uint256) {
        return _a.toUint256();
    }
}