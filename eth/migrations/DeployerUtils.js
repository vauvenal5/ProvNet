const ContractUtils = require("./ContractUtils");

class DeployerUtils {
    constructor() {
        this.abis = {};
        this.contracts = [];
    }

    initArtifacts (artifacts) {
        this.abis.SimpleProvenanceContract = artifacts.require("./contracts/SimpleProvenanceContract.sol");
    }

    setDeployer (deployer) {
        this.deployer = deployer;
    }

    deploySimpleProvenanceContract (title, description, logoUrl, accounts) {
        let contract = new ContractUtils(this.deployer, title);
        this.contracts.push(contract);
      
        this.deployer.deploy(this.abis.SimpleProvenanceContract, title).then((instance) => {
            contract.setInstance(instance);
        });

        contract.setDescription(description)
        .setLogoUrl(logoUrl)
        .addUser(accounts[0], "trusted")
        .addUser(accounts[0], "known")
        .addUser(accounts[0], "editor");
    
        return contract;
    };

    deployGroupsForInstitute (inst, numberGroups, nameGroup, accounts) {
        let desc = "This is a mock contract used for evaluation. It is not affiliated with the TU Wien!";
        let groupLogo = "http://dsg.tuwien.ac.at/images/dsg-logo.jpg";
        
        let groups = [];
    
        for(let i = 0; i<numberGroups; i++) {
            let group = this.deploySimpleProvenanceContract(nameGroup+i, desc, groupLogo, accounts);
            inst.twoWayLink(group, 1, 1);
            groups.push(group);
        }
    
        return groups;
    };

    deployInstituteWithGroups (numberGroups, nameInst, nameGroup, accounts) {
        let desc = "This is a mock contract used for evaluation. It is not affiliated with the TU Wien!";
        let instLogo = "http://www.informatik.tuwien.ac.at/kontakt/INF_Logo_typo_grau_web_rgb.png";
        //let groupLogo = "http://dsg.tuwien.ac.at/images/dsg-logo.jpg";
        
        nameGroup = this.getConcatTitle(nameInst, nameGroup);
        
        let inst = this.deploySimpleProvenanceContract(nameInst, desc, instLogo, accounts);
        let groups = this.deployGroupsForInstitute(inst, numberGroups, nameGroup, accounts);
        //let groups = [];
    
        // for(let i = 0; i<numberGroups; i++) {
        //     let group = this.deploySimpleProvenanceContract(nameGroup+i, desc, groupLogo, accounts);
        //     inst.twoWayLink(group, 1, 1);
        //     groups.push(group);
        // }
    
        return {inst, groups};
    };

    deployUniversityWithInsts(numberInsts, numberGroups, nameUni, nameInst, nameGroup, accounts) {
        let desc = "This is a mock contract used for evaluation. It is not affiliated with the TU Wien!";
        let logo = "https://www.tuwien.ac.at/fileadmin/t/tuwien/downloads/cd/CD_NEU_2009/TU_Logos_2009/TUSignet.jpg";

        nameInst = this.getConcatTitle(nameUni, nameInst);

        let uni = this.deploySimpleProvenanceContract(nameUni, desc, logo, accounts);
        let insts = [];

        for(let i = 0; i<numberInsts; i++) {
            let inst = this.deployInstituteWithGroups(numberGroups, nameInst+i, nameGroup, accounts);
            uni.twoWayLink(inst.inst, 1, 1);
            insts.push(inst);
        }

        return {uni, insts};
    }

    getConcatTitle(name1, name2) {
        return name1 + "-" + name2;
    }

    printContractAddresses() {
        this.deployer.then(() => this.contracts.map(contract => contract.printAddress()));
        //this.contracts.map(contract => contract.printAddress());
    }

    getFirstByTitle(title) {
        let contract = utils.contracts.filter(contract => contract.title === title)[0];
        contract.setDeployer(this.deployer);
        return contract;
    }
}

let utils = new DeployerUtils();

module.exports = utils;