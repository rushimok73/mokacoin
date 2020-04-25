var MokaTokenSale = artifacts.require('./MokaTokenSale.sol');

contract('MokaTokenSale', function(accounts){
  var tokenSaleInstance;
  var tokenPrice = 1000000000000000000; //in WEI

  it('Initializes the contract with correct values', function(){
    return MokaTokenSale.deployed().then(function(instance){
      tokenSaleInstance = instance;
      return tokenSaleInstance.address;
    }).then(function(address){
      assert.notEqual(address, 0x0, 'has contract address');
      return tokenSaleInstance.tokenContract();
    }).then(function(address){
      assert.notEqual(address, 0x0, 'has token contract');
      return tokenSaleInstance.tokenPrice();
    }).then(function(price){
      assert.equal(price, tokenPrice, 'token Price is correct');
    });
  });
});
