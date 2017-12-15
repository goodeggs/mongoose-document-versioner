# Mongoose Document Versioner

This module forces the version key to increment any time you save or update
a document. This is useful for detecting version conflicts.

Increments the document version on the following `pre` hooks:

* findOneAndUpdate
* updateOne
* updateMany
* update
* save

Note: Model.findByIdAndUpdate() calls the findOneAndUpdate hook.

## Usage

```js
const versionerPlugin = require('mongoose-document-versioner');

const schema = new mongoose.Schema({ /* .... */ });
schema.plugin(versionerPlugin);
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
