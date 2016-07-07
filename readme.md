# Mongoose Document Versioner

This module forces all your `Model.update()` and `Model.findOneAndUpdate()`
calls to `$inc` the `__v` value of the documents they touch, which will
hopefully help prevent version overwrite errors when you use `save()` calls.

## Usage

```js
const documentVersioner = require('mongoose-document-versioner');

const schema = new mongoose.Schema({ /* .... */ });
schema.plugin(documentVersioner);
const Model = mongoose.model('Model', schema);

/* EXAMPLES */

Model.update({attr: 'foo'}, {attr: 'bar'}, {multi: true});
/*
 * mongo query:
 * model.update(
 *   { attr: 'foo' },
 *   { '$inc': { __v: 1 }, '$set': { attr: 'bar' } },
 *   { multi: true }
 * )
 */

Model.findOneAndUpdate({attr: 'foo'}, {attr: 'bar'});
/*
 * mongo query:
 * model.findAndModify(
 *   { attr: 'foo' },
 *   { '$inc': { __v: 1 }, '$set': { attr: 'bar' } },
 *   { new: false, upsert: false }
 * )
 */
```
