const MokaToken = artifacts.require("MokaToken");
const MokaTokenSale = artifacts.require("MokaTokenSale");


module.exports = function(deployer) {
  deployer.deploy(MokaToken, 1000000).then(function(){
    var tokenPrice = 10;
    console.log(MokaToken.address);
    return deployer.deploy(MokaTokenSale, MokaToken.address, tokenPrice.toString()).then(function() {
      console.log(MokaTokenSale.address);
    });
  });

};
