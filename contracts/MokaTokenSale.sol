pragma solidity ^0.5.0;
import "./MokaToken.sol";

contract MokaTokenSale {
  address admin;
  MokaToken public tokenContract;
  uint256 public tokenPrice;

  constructor(MokaToken _tokenContract, uint256 _tokenPrice) public{
    admin = msg.sender;
    tokenContract = _tokenContract;
    tokenPrice = _tokenPrice;
  }
}
