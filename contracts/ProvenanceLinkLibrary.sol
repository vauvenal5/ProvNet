pragma solidity ^0.4.24;

import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";
import "../node_modules/ethereum-libraries-linked-list/contracts/LinkedListLib.sol";

//todo-sv: check why I have suddenly to deploy LinkedListLib
library ProvenanceLinkLibrary {
    using ProvenanceLinkLibrary for ProvenanceLinkLibrary.ProvenanceLinks;
    using LinkedListLib for LinkedListLib.LinkedList;
    using SafeMath for uint256;

    struct Link {
        address provenanceContract;
        string linkType;
        mapping (string => bool) hasProvenance;
    }

    struct ProvenanceLinks {
        LinkedListLib.LinkedList linkIndex;
        mapping (address => Link) links;
    }

    //todo-sv: read up on function modifiers in libraries; are there any security risks? will the access control in the contract function like expected?
    function addLink(ProvenanceLinks storage self, address _contract, string _type) internal {
        require(!self.linkIndex.nodeExists(convert(_contract)), "Link allready exists!");
        self.linkIndex.push(convert(_contract), true);
        self.links[_contract] = Link(_contract, _type);
    }

    function setLinkHasProvenance(ProvenanceLinks storage self, address _contract, string _url, bool _hasProvenance) internal {
        require(self.linkIndex.nodeExists(convert(_contract)), "Can not set hasProvenance since link does not exist.");
        self.links[_contract].hasProvenance[_url] = _hasProvenance;
    }

    function addLinkWithProvenance(ProvenanceLinks storage self, address _contract, string _type, string _url) internal {
        self.addLink(_contract, _type);
        self.setLinkHasProvenance(_contract, _url, true);
    }

    function getLinkCountForType(ProvenanceLinks storage self, string _type) internal view returns (uint256) {
        uint256 count = 0;

        (bool exists, uint256 pointer) = self.hasNext(0, _type);
        while(exists) {
            count = count.add(1);
            (exists,pointer) = self.hasNext(pointer, _type);
        }

        return count;
    }

    function getLinkListForType(ProvenanceLinks storage self, string _type) public view returns (address[]) {
        address[] memory links = new address[](self.getLinkCountForType(_type));
        uint256 count = 0;

        (bool exists, uint256 pointer) = self.hasNext(0, _type);
        while(exists) {
            links[count] = convert(pointer);
            count = count.add(1);
            (exists,pointer) = self.hasNext(pointer, _type);
        }

        return links;
    }

    function hasNext(ProvenanceLinks storage self, uint256 _pointer, string _type) internal view returns (bool, uint256) {
        //fake constants: this way they are only stored on stack until constants issue gets fixed
        //https://github.com/ethereum/solidity/issues/1290
        //we actually want to be abel to do: LinkedListLib.HEAD
        uint256 HEAD = 0;
        bool NEXT = true;
        
        (, uint256 pointer) = self.linkIndex.getAdjacent(_pointer, NEXT);
        while(pointer != HEAD) {
            address linkAddress = convert(pointer);
            Link memory link = self.links[linkAddress];
            
            if(compareStrings(link.linkType, _type)) {
                return (true, pointer);
            }
            
            (, pointer) = self.linkIndex.getAdjacent(pointer, NEXT);
        }
        return (false, 0);
    }

    function compareStrings(string _a, string _b) internal pure returns (bool) {
        if(keccak256(abi.encodePacked(_a)) == keccak256(abi.encodePacked(_b))) {
            return true;
        }

        return false;
    }

    function convert(address _address) internal pure returns (uint256) {
        return uint256(_address);
    }

    function convert(uint256 _address) internal pure returns (address) {
        return address(_address);
    }
}