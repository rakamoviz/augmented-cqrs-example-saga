const constants = require("../../constants");
const states = require("./states.json")

module.exports = require('augmented-cqrs/define').saga(constants.VERSION, {
  aggregate: 'order',
  context: 'sale',
  existing: true, 
  containingProperties: ['aggregate.id', 'payload.seats', 'payload.route', 'meta.transactionId'], 
  priority: 2,
  id: 'meta.transactionId'
}, function (evt, saga, callback) {
  saga.set('state', states.WAITING_FOR_B);

  var cmd = {
    // id: 'my own command id', // if you don't pass an id it will generate one, when emitting the command...
    name: 'updateRoute',
    aggregate: {
      id: evt.payload.route.id,
      name: 'route',
      revision: evt.payload.route.revision
    },
    version: 1,
    context: 'routemanagement',
    payload: {
      transactionId: saga.id,
      seats: evt.payload.seats
    }//,
  //    meta: evt.meta // to transport userId...   if not defined in cmd, it will defaultly use it from event
  };

  saga.addCommandToSend(cmd);
  saga.commit(callback);
});