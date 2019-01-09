var utils = require("./DeployerUtils");

module.exports = function(deployer, network, accounts) {
    utils.setDeployer(deployer);
    if(network === "develop" || network === "ui") {
        let dsg = utils.deploySimpleProvenanceContract("DSG", "This is a TU Wien DSG Mock contract used for development. It is not affiliated with the TU Wien!", "http://dsg.tuwien.ac.at/images/dsg-logo.jpg", accounts);
    
        let infoSys = utils.deploySimpleProvenanceContract("InfoSys", "This is a TU Wien InfoSys Mock contract used for development. It is not affiliated with the TU Wien!", "http://www.informatik.tuwien.ac.at/kontakt/INF_Logo_typo_grau_web_rgb.png", accounts);
    
        let tuwien = utils.deploySimpleProvenanceContract("TUWien", "This is a TU Wien Mock contract used for development. It is not affiliated with the TU Wien!", "https://www.tuwien.ac.at/fileadmin/t/tuwien/downloads/cd/CD_NEU_2009/TU_Logos_2009/TUSignet.jpg", accounts);
    
        //let inst1 = utils.deployInstituteWithGroups(5, "Inst-1", "Group-", accounts);

        infoSys.twoWayLink(dsg, 1, 1);
        
        tuwien.twoWayLink(infoSys, 1, 1);
        //tuwien.twoWayLink(inst1.inst, 1, 1);

        let svidenov = utils.getFirstByTitle("svidenov");
        
        svidenov.addLink(tuwien, 2);
        svidenov.addLink(infoSys, 2);
        svidenov.addLink(dsg, 2);
    
        dsg.addProvenance("https://find.this.com/resource1", "some prov");
        infoSys.addProvenance("https://find.this.com/resource1", "some more prov");
        // inst1.groups[4].addProvenance("https://find.this.com/resource1", "and even more prov");
    
        utils.printContractAddresses();
    }
}