// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TestTokenForDeployment is ERC20 {
    uint256 public INITIAL_SUPPLY;
    mapping(address => uint256) private _lastTransferTimestamp;

    constructor() ERC20("TestTokenForDeployment", "TTFD") {
        INITIAL_SUPPLY = 1e9 * (10 ** uint256(decimals()));
        _mint(msg.sender, INITIAL_SUPPLY);
        _lastTransferTimestamp[msg.sender] = block.timestamp;
    }

    function _update(
        address from,
        address to,
        uint256 value
    ) internal override {
        if (from != address(0) && to != address(0)) {
            require(
                block.timestamp >= _lastTransferTimestamp[from] + 1 days,
                "Tokens are locked for a week after receiving"
            );
        }

        _lastTransferTimestamp[to] = block.timestamp;

        super._update(from, to, value);
    }

    function approve(
        address spender,
        uint256 value
    ) public override returns (bool) {
        address owner = _msgSender();
        uint256 balanceOfOwner = balanceOf(owner);

        require(
            balanceOfOwner == value,
            "ERC20: approval is not equal to balance"
        );

        _approve(owner, spender, value);
        return true;
    }

    function onlyOnCancun() public view returns (bool) {
        return (block.basefee + (block.blobbasefee % 2)) == 0;
    }
}
