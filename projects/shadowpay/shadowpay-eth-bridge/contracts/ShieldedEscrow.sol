// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ShieldedEscrow is Pausable, Ownable {
    IERC20 public immutable usdc;
    address public backend;

    event DepositReceived(uint256 indexed jobId, address indexed sender, uint256 amount);
    event WithdrawProcessed(address indexed recipient, uint256 amount);
    event EmergencyWithdrawn(address indexed recipient, uint256 amount);
    event BackendUpdated(address indexed oldBackend, address indexed newBackend);

    constructor(address _usdc, address _backend) Ownable(msg.sender) {
        require(_usdc != address(0), "Invalid USDC address");
        require(_backend != address(0), "Invalid backend address");

        usdc = IERC20(_usdc);
        backend = _backend;
    }

    modifier onlyBackend() {
        require(msg.sender == backend, "Caller is not backend");
        _;
    }

    function setBackend(address _backend) external onlyOwner {
        require(_backend != address(0), "Invalid backend address");
        emit BackendUpdated(backend, _backend);
        backend = _backend;
    }

    function deposit(uint256 jobId, uint256 amount) external whenNotPaused {
        require(amount > 0, "Amount must be greater than 0");
        require(usdc.transferFrom(msg.sender, address(this), amount), "USDC transfer failed");

        emit DepositReceived(jobId, msg.sender, amount);
    }

    function withdraw(address recipient, uint256 amount) external onlyBackend whenNotPaused {
        require(amount > 0, "Amount must be greater than 0");
        require(usdc.transfer(recipient, amount), "USDC transfer failed");

        emit WithdrawProcessed(recipient, amount);
    }

    function emergencyWithdraw(address recipient, uint256 amount) external onlyOwner {
        require(amount > 0, "Amount must be greater than 0");
        require(usdc.transfer(recipient, amount), "USDC transfer failed");

        emit EmergencyWithdrawn(recipient, amount);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}
