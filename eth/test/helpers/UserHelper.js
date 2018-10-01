const expectEvent = require('../../node_modules/openzeppelin-solidity/test/helpers/expectEvent.js');
require('chai').should();

module.exports = {
    addUser: (async function(mock, user, role, fromUser) {
        const result = await mock.addUser(user, role, {from: fromUser});

        const event = await expectEvent.inLogs(result.logs, 'RoleAdded');
        event.args.operator.should.equal(user);
        event.args.role.should.equal(role);

        (await mock.hasRole(user, role)).should.be.true;
    }),
}