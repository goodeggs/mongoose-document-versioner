module.exports = function (schema) {
  ['update', 'findOneAndUpdate'].forEach(function (op) {
    schema.pre(op, function (next) {
      if (this.op === op) {
        this._update = this._update || {};
        this._update.$inc = this._update.$inc || {};
        this._update.$inc.__v = this._update.$inc.__v || 1;
      }
      next();
    });
  });
};
