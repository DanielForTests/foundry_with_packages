// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {UnsafeContract} from "./MoreUnsafe.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Counter {
    uint256 public number;

    constructor(uint256 _number) {
        // unsafe use of block timestamp for demonstration purposes
        if (block.timestamp % 2 == 0) {
            number = _number + 169;
        } else {
            number = _number;
        }
    }

    function setNumber(uint256 newNumber) public {
        number = newNumber;
    }

    function increment() public {
        number++;
    }
}
