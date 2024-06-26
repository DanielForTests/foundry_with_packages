// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract UnsafeContract {
    uint256 public number;

    function unsafeIncrement() public {
        if (block.timestamp % 2 == 0) {
            number++;
        }
    }
}
