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
    address _from,
    address _to,
    uint256 _value
  );

  //Approval event
  event Approval(
    address indexed _owner,
    address indexed _spender,
    uint256 _value
  );

  //Mapping to find out which address has how many tokens  address=>number_of_tokens
  mapping (address => uint256) public balanceOf;

  //Mapping for allowance
  mapping (address =>mapping(address => uint256)) public allowance;

  //using constructor
  constructor(uint256 _initialSupply) public{
    balanceOf[msg.sender] = _initialSupply;
    // Total value set to 1000000 on init.
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

  //Approve
  function approve(address _spender, uint256 _value) public returns(bool success){
    //allowance
    allowance[msg.sender][_spender] = _value;

    //emit Event
    emit Approval(msg.sender, _spender, _value);
    //return success
    return true;
  }


  function transferFrom(address _from, address _to, uint256 _value) public returns(bool success){
    require(_value <= balanceOf[_from]);

    require(_value <= allowance[_from][msg.sender]);

    balanceOf[_from] -= _value;
    balanceOf[_to] += _value;

    allowance[_from][msg.sender] -= _value;

    emit Transfer(_from, _to, _value);

    return true;

  }
}
