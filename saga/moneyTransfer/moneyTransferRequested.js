const constants = require("../../constants");
const states = require("./states.json")

module.exports = require('augmented-cqrs/define').saga(constants.VERSION, {
  aggregate: 'moneyTransfer',
  context: 'routemanagement',
  existing: false, 
  containingProperties: [
    'aggregate.id', 
    'payload.senderAccount.id', 
    'payload.senderAccount.revision', 
    'payload.receiverAccount.id',
    'payload.receiverAccount.revision', 
    'payload.amount', 
    'meta.transactionId'
  ], 
  priority: 2,
  id: 'meta.transactionId'
}, function (evt, saga, callback) {
  saga.set(evt.payload);
  
  //TODO: how to get an aggregate from a saga?
  //We don't. all the data needed in this block should be available in the event itself

  var cmd = {
    // id: 'my own command id', // if you don't pass an id it will generate one, when emitting the command...
    name: 'withdrawMoney',
    aggregate: {
      id: evt.payload.senderAccount.id,
      name: 'account',
      revision: evt.payload.senderAccount.revision
      /* 0 because the aggregate does not exist yet (we are requesting its creation now)
      * if the aggregate already existed, we would have gotten its number in the event (e.g.: routeRevision)
      */
    },
    version: 1,
    context: 'routemanagement',
    payload: {
      amount: evt.payload.amount
    }//,
    //    meta: evt.meta // to transport userId...   if not defined in cmd, it will defaultly use it from event
  };

  saga.addCommandToSend(cmd);

  saga.set('state', states.WAITING_WITHDRAW_CONFIRMATION);
  saga.commit(callback);
});