const set = require('lodash.set');
const has = require('lodash.has');

module.exports = function (schema) {
  function incrementVersionOnSave (next) {
    this.version++;
    next();
  }

  function incrementVersionOnUpdate (next) {
    if (
      !has(this, '_update.version') && 
      !has(this, '_update.$inc.version') && 
      !has(this, '_update.$set.version') && 
      !has(this, '_update.$setOnInsert.version')
    ) {
      set(this, '_update.$inc.version', 1);
    }
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
