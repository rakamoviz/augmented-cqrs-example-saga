module.exports = function create(
  config, msgbus, disconnectCallback, 
  {eventHandlingCallback, commandEmittingCallback, eventMissingHandler} = {}
) {
  return require("augmented-cqrs/saga")(
    `${__dirname}/saga`, config, msgbus, disconnectCallback, 
    {eventHandlingCallback, commandEmittingCallback, eventMissingHandler}
  );
}