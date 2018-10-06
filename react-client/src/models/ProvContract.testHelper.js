import ProvContract from './ProvContract';
import Tag from './Tag';
import Link from './Link';

let testContract = new ProvContract("testAddress");
testContract.details = {
    title: "MyTestContract",
    description: "This is a test contract!",
    logoUrl: "http://This/is/a/test/url.com"
}
testContract.types = {
    ["1"]: new Tag(1, "trusted"),
    ["2"]: new Tag(2, "known")
};
testContract.links = [
    new Link("linkAddress", [1,2], "tagTitle"),
    new Link("linkAddress2", [1], "tagTitle2")
]

export default testContract;