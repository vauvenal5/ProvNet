import ProvContract from './ProvContract';
import Tag from './Tag';
import Link from './Link';
import ContractDetails from './ContractDetails';

let testContract = new ProvContract("testAddress");

testContract = testContract.setDetails(
    new ContractDetails(
        "MyTestContract", 
        "This is a test contract!", 
        "http://This/is/a/test/url.com"
    )
);

export default testContract;