const { assertRevert } = require('../node_modules/openzeppelin-solidity/test/helpers/assertRevert');
const expectEvent = require('../node_modules/openzeppelin-solidity/test/helpers/expectEvent.js');
//const { assertRevert } = require('./helpers/AssertRevertHelper');

const SwitchableRBACWithSuperuserMock = artifacts.require("./SwitchableRBACWithSuperuserMock.sol");

const userHelper = require('./helpers/UserHelper');

contract('SwitchableRBACWithSuperuser', async([owner, newSuper, nonSuper, ...accounts]) => {
    var mock;
    const ROLE_SUPERUSER = "superuser";
    const ROLE_EDITOR = "editor";

    beforeEach(async function() {
        mock = await SwitchableRBACWithSuperuserMock.new();
    });

    context('superuser', async() => {
        it('should add 2nd superuser', async() => {
            await userHelper.addUser(mock, newSuper, ROLE_SUPERUSER, owner);
        });
        it('should not add superuser if not superuser', async() => {
            await assertRevert(
                mock.addUser(newSuper, ROLE_SUPERUSER, {from: nonSuper})
            );

            assert.isFalse(await mock.hasRole(newSuper, ROLE_SUPERUSER), "User should be a super user");
        });
        it("should allow superuser to remove other superuser", async() => {
            await userHelper.addUser(mock, newSuper, ROLE_SUPERUSER, owner);

            const result = await mock.removeUser(owner, ROLE_SUPERUSER, {from: newSuper});
            const event = await expectEvent.inLogs(result.logs, 'RoleRemoved');

            assert.equal(event.args.operator, owner, "RoleRemoved event should have correct user");
            assert.equal(event.args.role, ROLE_SUPERUSER, "RoleRemoved event should have correct role");

            assert.isTrue(await mock.hasRole(newSuper, ROLE_SUPERUSER), "User should be a super user");
            assert.isFalse(await mock.hasRole(owner, ROLE_SUPERUSER), "User should not be a super user");
        });
        it("should not be possible to open superuser", async() => {
            await assertRevert(
                mock.setRoleOpen(ROLE_SUPERUSER)
            );
        });
        it("should not be possible to close superuser", async() => {
            await assertRevert(
                mock.setRoleClosed(ROLE_SUPERUSER)
            );
        });
    });
    context('role', async() => {
        it("should restrict accesses", async() => {
            await userHelper.addUser(mock, nonSuper, ROLE_EDITOR, owner);
            
            (await mock.onlyByRoleOrOpenRole(ROLE_EDITOR, {from: nonSuper})).should.be.true;
            await assertRevert(mock.onlyByRoleOrOpenRole(ROLE_EDITOR));
        });
        it("should be openable to everyone", async() => {
            await userHelper.addUser(mock, nonSuper, ROLE_EDITOR, owner);
            await mock.setRoleOpen(ROLE_EDITOR);

            (await mock.onlyByRoleOrOpenRole(ROLE_EDITOR, {from: nonSuper})).should.be.true;
            (await mock.onlyByRoleOrOpenRole(ROLE_EDITOR, {from: owner})).should.be.true;
        });
        it("should be closable again", async() => {
            await userHelper.addUser(mock, nonSuper, ROLE_EDITOR, owner);
            await mock.setRoleOpen(ROLE_EDITOR);
            await mock.setRoleClosed(ROLE_EDITOR);       

            (await mock.onlyByRoleOrOpenRole(ROLE_EDITOR, {from: nonSuper})).should.be.true;
            await assertRevert(mock.onlyByRoleOrOpenRole(ROLE_EDITOR));
        });
    });
});