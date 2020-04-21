var MokaToken = artifacts.require('./MokaToken.sol');

contract('MokaToken', function(accounts){

  it('Sets the total supply upon deployment', function(){
    return MokaToken.deployed().then(function(instance){
      tokenInstance = instance;
      return tokenInstance.totalSupply();
    }).then(function(totalSupply){
      assert.equal(totalSupply.toNumber(),1000000,'Sets the value to 1,000,0000');
    })
  });

})
