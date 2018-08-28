pragma solidity ^0.4.24;

import "../libs/StringUtils.sol";

contract StringUtilsLibraryMock {
    using StringUtils for string;

    function equalHashWithLengthCheck(string _a, string _b) public pure returns (bool) {
        return _a.equalHashWithLengthCheck(_b);
    }
}