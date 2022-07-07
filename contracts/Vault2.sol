//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Vault2 is ERC20 {
    constructor() ERC20("VAULT", "VLT") {}

    function mint() public payable {
        _mint(msg.sender, msg.value);
    }

    function burn(uint256 _amount) public {
        require(balanceOf(msg.sender) >= _amount, "Not enough tokens");
        _burn(msg.sender, _amount);
        payable(msg.sender).transfer(_amount);
    }
}