class Utils {
    constructor(artifacts, deployer) {
        this.artifacts = artifacts;
        this.deployer = deployer;

        this.abis = {};
        this.abis.SimpleProvenanceContract = artifacts.require("./contracts/SimpleProvenanceContract.sol");
        this.contracts = {};
    }

    deploySimpleProvenanceContract (deployer, title, description, logoUrl, accounts) {
        let contract = new Utils(this.artifacts);
      
        deployer.deploy(this.abis.SimpleProvenanceContract).then((instance) => {
            contract.instance = instance;
        });
    
        deployer.then(() => {
            return contract.instance.setTitle(title);
        }).then(() => {
            return contract.instance.setDescription(description);
        }).then(() => {
            return contract.instance.setLogoUrl(logoUrl);
        }).then(() => {
            return contract.instance.addUser(accounts[0], "trusted");
        }).then(() => {
            return contract.instance.addUser(accounts[0], "known");
        }).then(() => {
            return contract.instance.addUser(accounts[0], "editor");
        }).then(() => {
            return contract.instance.putProvenanceRecord(
            "https://react.semantic-ui.com/collections/table/#types-pagination",
            "this is a default text simulating a provenance entry"
            );
        }).then(() => {
            return contract.instance.putProvenanceRecord(
            "https://url2",
            "this is another default text simulating a provenance entry"
            );
        });
    
        return contract;
    };

    deployInstituteWithGroups (deployer, numberGroups, nameInst, nameGroup, accounts) {
        let inst = this.deploySimpleProvenanceContract(deployer, nameInst, "This is a TU Wien InfoSys Mock contract used for development. It is not affiliated with the TU Wien!", "http://www.informatik.tuwien.ac.at/kontakt/INF_Logo_typo_grau_web_rgb.png", accounts);
        let groups = [];
    
        for(let i = 0; i<numberGroups; i++) {
            let group = this.deploySimpleProvenanceContract(deployer, nameGroup+i, "This is a TU Wien DSG Mock contract used for development. It is not affiliated with the TU Wien!", "http://dsg.tuwien.ac.at/images/dsg-logo.jpg", accounts);
            this.twoWayLink(deployer, inst, group, 1, 1);
            groups.push(group);
        }
    
        return {inst, groups};
    };

    addProvenance (deployer, contract, url, content) {
        deployer.then(() => contract.instance.putProvenanceRecord(url, content));
        return this;
    }

    twoWayLink (deployer, c1, c2, tl1, tl2) {
        this.addLink(deployer, c1, c2, tl1);
        this.addLink(deployer, c2, c1, tl2);
        return this;
    };

    addLink (deployer, c1, c2, type) {
        deployer.then(() => c1.instance.addLink(c2.instance.address, type));
        return this;
    };
}

module.exports = Utils;