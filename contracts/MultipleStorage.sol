// SPDX-License-Identifier: MIT
pragma solidity ^0.5.16;

contract MultipleStorage {
    string[] ipfs_hashes;

    function add(string memory x) public {
        ipfs_hashes.push(x);
    }

    function getConcatStr() public view returns (string memory) {
        uint256 totalLen = 0;
        for (uint256 i = 0; i < ipfs_hashes.length; i++) {
            totalLen += bytes(ipfs_hashes[i]).length;
        }
        uint256 commaCnt = ipfs_hashes.length;
        // string memory concatStr = new string(totalLen+commaCnt);
        bytes memory concatBytes = new bytes(totalLen + commaCnt);
        uint256 ptr = 0;

        string memory comma = ",";
        bytes memory commaByte = bytes(comma);

        for (uint256 i = 0; i < ipfs_hashes.length; i++) {
            bytes memory currByteStr = bytes(ipfs_hashes[i]);
            for (uint256 j = 0; j < currByteStr.length; j++) {
                concatBytes[ptr] = currByteStr[j];
                ptr += 1;
            }
            if (i != ipfs_hashes.length - 1) {
                concatBytes[ptr] = commaByte[0];
                ptr += 1;
            }
        }
        return string(concatBytes);
    }

    function get() public view returns (string memory) {
        return getConcatStr();
    }
}
