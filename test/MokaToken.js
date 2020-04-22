var MokaToken = artifacts.require('./MokaToken.sol');

contract('MokaToken', function(accounts) {
  var tokenInstance;

  it('Initializes contract with correct values', function() {
    return MokaToken.deployed().then(function(instance) {
      tokenInstance = instance;
      return tokenInstance.name();
    }).then(function(name) {
      assert.equal(name, 'Mokacoin', 'Sets the name corrrectly');
      return tokenInstance.symbol();
    }).then(function(symbol) {
      assert.equal(symbol, 'MKC', 'Sets symbol corrrectly');
      return tokenInstance.standard();
    }).then(function(standard) {
      assert.equal(standard, 'Mokacoin v1.0', 'Sets standard corrrectly');
    });
  });

  it('Sets the total supply upon deployment', function() {
    return MokaToken.deployed().then(function(instance) {
      tokenInstance = instance;
      return tokenInstance.totalSupply();
    }).then(function(totalSupply) {
      assert.equal(totalSupply.toNumber(), 1000000, 'Sets the value to 1,000,0000');
      return tokenInstance.balanceOf(accounts[0]);
    }).then(function(adminBalance) {
      assert.equal(adminBalance.toNumber(), 1000000, 'it sets the adminBalance to 1,000,000');
    });
  });

  it('transfers ownership', function() {
    return MokaToken.deployed().then(function(instance) {
      tokenInstance = instance;
      //Tests require statement first by transferring something larger than the senders balance
      return tokenInstance.transfer.call(accounts[1], 999999999999);
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('revert') >= 0, 'error message must contain revert');
      return tokenInstance.transfer.call(accounts[1], 250000, {  from: accounts[0] });
    }).then(function(success){
      assert.equal(success, true, 'it returns true');
      return tokenInstance.transfer(accounts[1], 250000, {  from: accounts[0] });
    }).then(function(receipt) {
      assert.equal(receipt.logs.length, 1, 'triggers one event');
      assert.equal(receipt.logs[0].event, 'Transfer', 'should be the "Transfer" event');
      assert.equal(receipt.logs[0].args._from, accounts[0], 'logs the account the tokens are transferred from');
      assert.equal(receipt.logs[0].args._to, accounts[1], 'logs the account the tokens are transferred to');
      assert.equal(receipt.logs[0].args._value, 250000, 'logs the transfer amount');
      return tokenInstance.balanceOf(accounts[1]);
    }).then(function(balance) {
      assert.equal(balance.toNumber(), 250000, 'adds the amount to recieving account');
      return tokenInstance.balanceOf(accounts[0]);
    }).then(function(balance) {
      assert.equal(balance.toNumber(), 750000, 'deducts amount from sender');
    });
  });

});
