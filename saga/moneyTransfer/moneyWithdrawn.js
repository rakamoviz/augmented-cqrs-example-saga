const constants = require("../../constants");
const states = require("./states.json")

module.exports = require('augmented-cqrs/define').saga(constants.VERSION, {
  aggregate: 'account',
  context: 'routemanagement',
  existing: false, 
  containingProperties: [
    'aggregate.id', 
    'meta.transactionId'
  ], 
  priority: 2,
  id: 'meta.transactionId'
}, function (evt, saga, callback) {
  const receiverAccount = saga.get("receiverAccount");
  var cmd = {
    // id: 'my own command id', // if you don't pass an id it will generate one, when emitting the command...
    name: 'depositMoney',
    aggregate: {
      id: receiverAccount.id,
      name: 'account',
      revision: receiverAccount.revision
    },
    version: 1,
    context: 'routemanagement',
    payload: {
      amount: saga.get("amount")
    }//,
    //    meta: evt.meta // to transport userId...   if not defined in cmd, it will defaultly use it from event
  };

  saga.addCommandToSend(cmd);

  saga.set('state', states.WAITING_DEPOSIT_CONFIRMATION);
  saga.commit(callback);
});