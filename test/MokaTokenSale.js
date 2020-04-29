var MokaTokenSale = artifacts.require('./MokaTokenSale.sol');
var MokaToken = artifacts.require('./MokaToken.sol');

contract('MokaTokenSale', function(accounts){
  var tokenSaleInstance;
  var value;
  var tokenInstance;
  var admin = accounts[0];
  var buyer = accounts[9];
  var tokensAvailable = 750000;
  var tokenPrice = 10; //in WEI
  var numberofTokens = 10;

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

  it('Facilitates token buying', function(){
    return MokaToken.deployed().then(function(instance){
      //Get tokenInstance
      tokenInstance = instance;
      return MokaTokenSale.deployed();
    }).then(function(instance){
      //Get tokenSaleInstance
      tokenSaleInstance = instance;
      return tokenInstance.transfer(tokenSaleInstance.address, tokensAvailable, {from: admin});
    }).then(function(receipt){
      return tokenSaleInstance.buyTokens(numberofTokens, { from: buyer, value: numberofTokens*tokenPrice})
    }).then(function(receipt){
      assert.equal(receipt.logs.length, 1, 'triggers one event');
      assert.equal(receipt.logs[0].event, 'Sell', 'should be the "Sell" event');
      assert.equal(receipt.logs[0].args._buyer, buyer, 'logs the buyer who purchased the tokens');
      assert.equal(receipt.logs[0].args._amount, numberofTokens, 'logs the number of tokens bought');
      return tokenSaleInstance.tokensSold();
    }).then(function(amount){
      assert.equal(amount.toNumber(), numberofTokens, 'increments the number of tokens');
      return tokenInstance.balanceOf(buyer);
    }).then(function(balance){
      assert.equal(balance.toNumber(), numberofTokens, 'buyer balance correct');
      return tokenInstance.balanceOf(tokenSaleInstance.address);
    }).then(function(balance){
      assert.equal(balance.toNumber(), tokensAvailable - numberofTokens, 'Contract balance correct');
      return tokenSaleInstance.buyTokens(numberofTokens, {from: buyer, value: 1});
    }).then(assert.fail).catch(function(error){
      assert(error.message.indexOf('revert') >= 0, 'it prevents scam');
      numberofTokens = 800000;
      return tokenSaleInstance.buyTokens(numberofTokens, { from: buyer, value: numberofTokens*tokenPrice});
    }).then(assert.fail).catch(function(error){
      assert(error.message.indexOf('revert') >= 0, 'cannot purchase more than tokensAvailable');
    });
  });

  // it('ends token sale ', function(){
  //   return MokaToken.deployed().then(function(instance){
  //     tokenInstance = instance;
  //     return MokaTokenSale.deployed();
  //   }).then(function(instance){
  //     tokenSaleInstance = instance;
  //     return tokenSaleInstance.endsale({from : buyer});
  //   }).then(assert.fail).catch(function(error){
  //     assert(error.message.indexOf('revert')>=0, 'must be admin to endsale');
  //   });
  // });
});
