# Mongoose Document Versioner

This module sets a document `version` key that is incremented
any time you save or update a document. This is useful for
detecting version conflicts.

Increments `version` on the following `pre` hooks:

* `findOneAndUpdate`
* `updateOne`
* `updateMany`
* `update`
* `save`

Note: `Model.findByIdAndUpdate()` calls the `findOneAndUpdate` hook.

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
 *   { '$inc': { version: 1 }, '$set': { attr: 'bar' } },
 *   { multi: true }
 * )
 */

Model.findOneAndUpdate({attr: 'foo'}, {attr: 'bar'});
/*
 * mongo query:
 * model.findAndModify(
 *   { attr: 'foo' },
 *   { '$inc': { version: 1 }, '$set': { attr: 'bar' } },
 *   { new: false, upsert: false }
 * )
 */
```
