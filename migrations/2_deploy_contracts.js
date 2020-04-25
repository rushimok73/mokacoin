const MokaToken = artifacts.require("MokaToken");
const MokaTokenSale = artifacts.require("MokaTokenSale");


module.exports = function(deployer) {
  deployer.deploy(MokaToken, 1000000).then(function(){
    var tokenPrice = 1000000000000000000;
    return deployer.deploy(MokaTokenSale, MokaToken.address, tokenPrice.toString());
  });

};
