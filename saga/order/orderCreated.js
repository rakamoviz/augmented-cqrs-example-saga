const constants = require("../../constants");
const states = require("./states.json")

module.exports = require('augmented-cqrs/define').saga(constants.VERSION, {
  aggregate: 'order',
  context: 'sale',
  existing: false, 
  containingProperties: ['aggregate.id', 'payload.totalCosts', 'payload.seats', 'meta.transactionId'], 
  priority: 2,
  id: 'meta.transactionId'
}, function (evt, saga, callback) {
  saga.set('orderId', evt.aggregate.id);
  saga.set('totalCosts', evt.payload.totalCosts);
  saga.set('state', states.WAITING_FOR_A);

  //TODO: how to get an aggregate from a saga?
  //We don't. all the data needed in this block should be available in the event itself

  var cmd = {
    // id: 'my own command id', // if you don't pass an id it will generate one, when emitting the command...
    name: 'createRoute',
    aggregate: {
      id: evt.aggregate.id + "_route",
      name: 'route',
      revision: 0 
      /* 0 because the aggregate does not exist yet (we are requesting its creation now)
      * if the aggregate already existed, we would have gotten its number in the event (e.g.: routeRevision)
      */
    },
    version: 1,
    context: 'routemanagement',
    payload: {
      name: evt.aggregate.id + "_name",
      transactionId: saga.id,
      seats: evt.payload.seats
    }//,
    //    meta: evt.meta // to transport userId...   if not defined in cmd, it will defaultly use it from event
  };

  saga.addCommandToSend(cmd);
  saga.commit(callback);
});