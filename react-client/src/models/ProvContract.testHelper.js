import ProvContract from './ProvContract';
import Tag from './Tag';
import Link from './Link';
import ContractDetails from './ContractDetails';
import TagList from './TagList';
import LinkList from './LinkList';

let testContract = new ProvContract("testAddress");

testContract = testContract.setDetails(
    new ContractDetails(
        "MyTestContract", 
        "This is a test contract!", 
        "http://This/is/a/test/url.com"
    )
);

testContract = testContract.setTags(
    new TagList(
        new Tag(1, "trusted"),
        new Tag(2, "known")
    )
);

testContract = testContract.setLinks(
    new LinkList(
        new Link("linkAddress", [1,2], "tagTitle"), 
        new Link("linkAddress2", [1], "tagTitle2")
    )
);

export default testContract;