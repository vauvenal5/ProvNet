pragma solidity ^0.4.24;

library StringUtils {
    function equalHashWithLengthCheck(string self, string _b) internal pure returns (bool) {
        if(bytes(self).length != bytes(_b).length) {
            return false;
        }

        return keccak256(abi.encodePacked(self)) == keccak256(abi.encodePacked(_b));
    }
}