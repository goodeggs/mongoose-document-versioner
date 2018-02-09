const assert = require('assert');
const mongoose = require('mongoose');

const documentVersioner = require('../src');

mongoose.connect('mongodb://localhost/mongoose-document-versioner', { useMongoClient: true });
mongoose.Promise = Promise;

const starshipSchema = new mongoose.Schema({
  name: String,
  class: String,
});

starshipSchema.plugin(documentVersioner);

const Starship = mongoose.model('Starship', starshipSchema);

describe('Mongoose document versioner', function () {
  beforeEach(function () {
    return Starship.remove();
  });

  it('bumps the version of a document with save()', function () {
    return Starship.create({name: 'USS Defiant'})
      .then(function (ship) {
        assert.equal(ship.version, 1);
        return ship.set({name: 'USS Defiant', class: 'Defiant'}).save()
          .then(() => Starship.findOne({_id: ship.id}));
      })
      .then(function (ship) {
        assert.equal(ship.version, 2);
      });
  });

  it('bumps the version of a document with an updateOne query', function () {
    return Starship.create({name: 'USS Vengeance'})
      .then(function (ship) {
        assert.equal(ship.version, 1);
        return Starship.updateOne({name: 'USS Vengeance'}, {class: 'Dreadnought'})
          .then(function () {
            return Starship.findById(ship.id);
          });
      })
      .then(function (ship) {
        assert.equal(ship.version, 2);
      });
  });

  it('correctly handles updateOne when the version is set in the query', function () {
    return Starship.create({name: 'USS Geronimo'})
      .then(function (ship) {
        assert.equal(ship.version, 1);
        return Starship.updateOne({name: 'USS Geronimo'}, {version: 3})
          .then(function () {
            return Starship.findById(ship.id);
          });
      })
      .then(function (ship) {
        assert.equal(ship.version, 3);
      });
  });

  it('correctly handles findOneAndUpdate when the version is set in the query', function () {
    return Starship.create({name: 'USS Geronimo'})
      .then(function (ship) {
        assert.equal(ship.version, 1);
        return Starship.findOneAndUpdate({name: 'USS Geronimo'}, {version: 3}, {new: true})
          .then(function () {
            return Starship.findById(ship.id);
          });
      })
      .then(function (ship) {
        assert.equal(ship.version, 3);
      });
  });

  it('bumps the version of a document with an updateMany query', function () {
    return Promise.all([
      Starship.create({ name: 'USS Enterprise', class: 'Enterprise' }),
      Starship.create({ name: 'USS Excalibur', class: 'Enterprise' }),
      Starship.create({ name: 'USS Constellation', class: 'Enterprise' })
    ])
      .then(function (ships) {
        ships.forEach(function (ship) {
          assert.equal(ship.version, 1);
        });
        return Starship.updateMany({class: 'Enterprise'}, {class: 'Constitution'})
          .then(function () {
            return Starship.find({class: 'Constitution'});
          });
      })
      .then(function (ships) {
        ships.forEach(function (ship) {
          assert.equal(ship.version, 2);
        });
      });
  });

  it('understands update with upsert', function () {
    return Starship.update({name: 'USS Thomas Paine'}, {class: 'New Orleans'}, {upsert: true})
      .then(function () {
        return Starship.findOne({name: 'USS Thomas Paine'});
      })
      .then(function (ship) {
        assert.equal(ship.version, 1);
      });
  });

  it('bumps the version of a document with a findOneAndUpdate query', function () {
    return Starship.create({name: 'USS Enterprise D'})
      .then(function (ship) {
        assert.equal(ship.version, 1);
        return Starship.findOneAndUpdate({name: 'USS Enterprise D'}, {class: 'Ambassador'});
      })
      .then(function (ship) {
        return Starship.findOne({_id: ship.id});
      })
      .then(function (ship) {
        assert.equal(ship.version, 2);
      });
  });

  it('understands findOneAndUpdate with upsert', function () {
    return Starship.findOneAndUpdate({name: 'USS Carolina'}, {class: 'Daedalus'}, {upsert: true, new: true})
      .then(function (ship) {
        assert.equal(ship.version, 1);
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
