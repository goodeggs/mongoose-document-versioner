const set = require('lodash.set');

module.exports = function (schema) {
  function incrementVersionOnSave (next) {
    this.version++;
    next();
  }

  function incrementVersionOnUpdate (next) {
    set(this, '_update.$inc.version', 1);
    next();
  }

  schema.add({
    version: {
      type: Number,
      required: true,
      default: 0
    }
  });

  schema.pre('save', incrementVersionOnSave);
  schema.pre('findOneAndUpdate', incrementVersionOnUpdate);
  schema.pre('updateOne', incrementVersionOnUpdate);
  schema.pre('updateMany', incrementVersionOnUpdate);
  schema.pre('update', incrementVersionOnUpdate);
};
