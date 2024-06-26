// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {UnsafeContract} from "./MoreUnsafe.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Counter {
    uint256 public number;
    constructor(uint256 _number) {
        number = _number;
        if (block.timestamp % 2 == 0) {
            number = _number;
        } else {
            number = 0;
        }
    }

    function setNumber(uint256 newNumber) public {
        number = newNumber;
    }

    function increment() public {
        number++;
    }
}
