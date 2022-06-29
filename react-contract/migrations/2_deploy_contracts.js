
var MyContract = artifacts.require("../contracts/myContract.sol");
module.exports = function (deployer) {
    deployer.deploy(MyContract);
  };