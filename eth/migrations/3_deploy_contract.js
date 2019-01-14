var utils = require("./DeployerUtils");

module.exports = function(deployer, network, accounts) {
    utils.initArtifacts(artifacts);
    utils.setDeployer(deployer);

    let svidenov = utils.deploySimpleProvenanceContract("svidenov", "This is the contract of the ProvNet developer.", "https://avatars3.githubusercontent.com/u/1935503?s=460&v=4", accounts);

    utils.printContractAddresses();
};
