// SPDX-License-Identifier: MIT
pragma solidity ^0.5.16;

contract SimpleStorage {
    string ipfs_hash = '';

    function set(string memory x) public {
        ipfs_hash = x;
    }

    function get() public view returns (string memory) {
        return ipfs_hash;
    }
}
