pragma solidity ^0.4.24;

import "../../contracts/libs/Uint256Utils.sol";

contract Uint256UtilsMock {
    using Uint256Utils for uint256;

    function convert(uint256 _a) public pure returns (address) {
        return _a.toAddress();
    }
}