//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Vault1 {
    address owner;
    mapping(address => mapping(IERC20 => uint256)) public erc20Balances;

    event Deposit(address indexed _from, IERC20 indexed _token, uint256 _amount);
    event Withdraw(address indexed _to, IERC20 indexed _token, uint256 _amount);

    constructor() {
        owner = msg.sender;
    }

    function deposit(uint256 _amount, IERC20 _token) external {
        require(_amount > 0, "Amount can not be zero");
        erc20Balances[msg.sender][_token] += _amount;
        IERC20(_token).transferFrom(msg.sender, address(this), _amount);
        emit Deposit(msg.sender, _token, _amount);
    }

    function withdraw(uint256 _amount, IERC20 _token) external {
        require(_amount > 0, "Amount can not be zero");
        require(erc20Balances[msg.sender][_token] >= _amount,"Account has not enough tokens in the vault");
        erc20Balances[msg.sender][_token] -= _amount;
        bool success = IERC20(_token).transfer(msg.sender, _amount);
        require(success, "Transfer failed.");
        emit Withdraw(msg.sender, _token, _amount);
    }

    function tokenBalanceOf(address _account, IERC20 _token) external view returns (uint256)
    {
        return erc20Balances[_account][_token];
    }
}
