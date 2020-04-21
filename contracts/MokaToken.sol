pragma solidity ^0.5.0; //Solidity Version

contract MokaToken{
  //constructor
  //set total number of tokens
  //read total number of tokens

  uint256 public totalSupply;       //This is a state variable.Accessible in the entire contract.

  constructor() public{      //using constructor
    totalSupply = 1000000;          // Total value set to 1000000 on init. This is ERC 20 standard.
  }
}
