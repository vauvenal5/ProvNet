export default class Network{
    constructor(proj, dsg, infosys, instx, tu, 
        search16, search32, search64, search128, search256, search512) {
        this.proj = proj;
        this.dsg = dsg;
        this.infosys = infosys;
        this.instx = instx;
        this.tu = tu;
        this.searches = {
            search16,
            search32,
            search64,
            search128,
            search256,
            search512
        };
    }
}