// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ChainlinkClient} from "chainlink/src/v0.8/ChainlinkClient.sol";

contract Counter is ERC721, ChainlinkClient {
    uint256 public number;

    constructor() ERC721("MyNFT", "MNFT") {}

    function setNumber(uint256 newNumber) public {
        number = newNumber;
    }

    function increment() public {
        number++;
    }
}
