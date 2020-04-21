const MokaToken = artifacts.require("MokaToken");

module.exports = function(deployer) {
  deployer.deploy(MokaToken);
};
