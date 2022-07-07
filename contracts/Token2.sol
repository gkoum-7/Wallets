//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token2 is ERC20 {
    uint256 constant _initial_supply = 100 * (10**2);

    constructor() ERC20("T2", "T2") {
        _mint(msg.sender, _initial_supply);
    }
}