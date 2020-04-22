pragma solidity ^0.5.0; //Solidity Version

contract MokaToken{

  //Name
  string public name = 'Mokacoin';

  //Symbol
  string public symbol = 'MKC';

  //standard
  string public standard = 'Mokacoin v1.0';

  //This is a state variable.Accessible in the entire contract.
  uint256 public totalSupply;

  //Transfer Event
  event Transfer(
    address indexed _from,
    address indexed _to,
    uint256 _value
  );

  //Mapping to find out which address has how many tokens  address=>number_of_tokens
  mapping (address => uint256) public balanceOf;

  //using constructor
  constructor(uint256 _initialSupply) public{
    balanceOf[msg.sender] = _initialSupply;
    // Total value set to 1000000 on init. This is ERC 20 standard.
    totalSupply = _initialSupply;
  }

  //Transfer coins
  function transfer(address _to,uint256 _value) public returns (bool success) {
      //if this evaluates to true continue execution, else stop. This saves GAS.
      require(balanceOf[msg.sender] >= _value);

      balanceOf[msg.sender] -= _value;
      balanceOf[_to] += _value;
      emit Transfer(msg.sender, _to, _value);

      return true;
  }
}
