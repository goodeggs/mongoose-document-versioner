const set = require('lodash.set');

function incrementVersionOnSave (next) {
  this.increment();
  next();
}

function incrementVersionOnUpdate (next) {
  const versionKey = this.schema.options.versionKey || '__v';

  set(this, '_update.$inc.' + versionKey, 1);

  if (this._update.$setOnInsert) {
    delete this._update.$setOnInsert[versionKey];
    if (Object.keys(this._update.$setOnInsert).length === 0) {
      delete this._update.$setOnInsert;
    }
  }
  
  next();
}

module.exports = function (schema) {
  schema.pre('save', incrementVersionOnSave);
  schema.pre('findOneAndUpdate', incrementVersionOnUpdate);
  schema.pre('updateOne', incrementVersionOnUpdate);
  schema.pre('updateMany', incrementVersionOnUpdate);
  schema.pre('update', incrementVersionOnUpdate);
};
