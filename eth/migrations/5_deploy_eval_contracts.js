var utils = require("./DeployerUtils");

module.exports = function(deployer, network, accounts) {
    utils.setDeployer(deployer);
    if(network === "eval") {
        let search = utils.deploySimpleProvenanceContract("SearchContract", "This is a simple search provider provenance contract. The purpose is to help provide a complete view of the provenance network.", "https://avatars3.githubusercontent.com/u/1935503?s=460&v=4", accounts);

        let tuwien = utils.deploySimpleProvenanceContract("TUWien", "This is a TU Wien Mock contract used for development. It is not affiliated with the TU Wien!", "https://www.tuwien.ac.at/fileadmin/t/tuwien/downloads/cd/CD_NEU_2009/TU_Logos_2009/TUSignet.jpg", accounts);

        let infoSys = utils.deploySimpleProvenanceContract("TU-InfoSys", "This is a TU Wien InfoSys Mock contract used for development. It is not affiliated with the TU Wien!", "http://www.informatik.tuwien.ac.at/kontakt/INF_Logo_typo_grau_web_rgb.png", accounts);

        let dsg = utils.deploySimpleProvenanceContract("TU-InfoSys-DSG", "This is a TU Wien DSG Mock contract used for development. It is not affiliated with the TU Wien!", "http://dsg.tuwien.ac.at/images/dsg-logo.jpg", accounts);

        //todo-sv: move accounts inside utils?
        utils.deployGroupsForInstitute(infoSys, 4, "TU-InfoSys-Group", accounts);
    
        let inst1 = utils.deployInstituteWithGroups(5, "TU-Inst1", "Group", accounts);
        let inst2 = utils.deployInstituteWithGroups(5, "TU-Inst2", "Group", accounts);
        let inst3 = utils.deployInstituteWithGroups(5, "TU-Inst3", "Group", accounts);

        infoSys.twoWayLink(dsg, 1, 1);
        
        tuwien.twoWayLink(infoSys, 1, 1);
        tuwien.twoWayLink(inst1.inst, 1, 1);
        tuwien.twoWayLink(inst2.inst, 1, 1);
        tuwien.twoWayLink(inst3.inst, 1, 1);

        let unix = utils.deployUniversityWithInsts(3, 5, "UniX", "Inst", "Group", accounts);
        let uniy = utils.deployUniversityWithInsts(3, 5, "UniY", "Inst", "Group", accounts);
        
        search.addLink(tuwien, 2);
        search.addLink(unix.uni, 2);
        search.addLink(uniy.uni, 2);

        dsg.addProvenance("https://find.this.com/scenario2", "some prov");
        uniy.insts[1].groups[2].addProvenance("https://find.this.com/scenario2", "some apparently hidden prov");
        
        dsg.addProvenance("https://find.this.com/scenario3", "some prov");
        unix.insts[2].groups[3].addProvenance("https://find.this.com/scenario3", "not to the TU related prov, but resource related");
        
    
        // inst1.inst.addProvenance("https://find.this.com/resource1", "some prov");
        // inst1.groups[2].addProvenance("https://find.this.com/resource1", "some more prov");
        // inst1.groups[4].addProvenance("https://find.this.com/resource1", "and even more prov");
    
        utils.printContractAddresses();
    }
}