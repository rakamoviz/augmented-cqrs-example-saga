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
  saga.set('state', states.COMPLETED);
  //saga.destroy();
  saga.commit(callback);
});