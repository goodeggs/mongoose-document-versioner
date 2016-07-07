/* eslint-env goodeggs/server-side-test */
require('goodeggs-ops-api-test-helpers/server');

const mongoose = require('mongoose');

const documentVersioner = require('./index');

mongoose.connect('mongodb://localhost/test');
mongoose.Promise = Promise;

const schema = new mongoose.Schema({
  name: String,
  class: String,
});
schema.plugin(documentVersioner);

const Spaceship = mongoose.model('Spaceship', schema);

describe('Mongoose document versioner', function () {
  beforeEach(function () {
    return Spaceship.remove();
  });

  it('bumps the version of a document with an update query', function () {
    return Spaceship.create({name: 'USS Voyager'})
    .then(function (enterprise) {
      expect(enterprise).to.have.property('__v', 0);
      return Spaceship.update({name: 'USS Voyager'}, {class: 'Intrepid'})
      .then(() => Spaceship.findOne({_id: enterprise.id}));
    })
    .then(function (enterprise) {
      expect(enterprise).to.have.property('__v', 1);
    });
  });

  it('bumps the version of a document with a findOneAndUpdate query', function () {
    return Spaceship.create({name: 'USS Enterprise D'})
    .then(function (enterprise) {
      expect(enterprise).to.have.property('__v', 0);
      return Spaceship.findOneAndUpdate({name: 'USS Enterprise D'}, {class: 'Ambassador'});
    })
    .then(function (enterprise) {
      return Spaceship.findOne({_id: enterprise.id});
    })
    .then(function (enterprise) {
      expect(enterprise).to.have.property('__v', 1);
    });
  });
});

after(function (done) {
  /* WTF: https://github.com/Automattic/mongoose/issues/1251 */
  mongoose.models = {};
  mongoose.modelSchemas = {};
  mongoose.connection.close();
  done();
});
