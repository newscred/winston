/*
 * file-test.js: Tests for instances of the File transport
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENSE
 *
 */

var path = require('path'),
    vows = require('vows'),
    fs = require('fs'),
    assert = require('assert'),
    winston = require('../../lib/winston'),
    common = require('../../lib/winston/common'),
    sinon = require('sinon'),
    helpers = require('../helpers');

var transport = require('./transport');

var testMetadata = { meta: 'data' };

var stream = fs.createWriteStream(
      path.join(__dirname, '..', 'fixtures', 'logs', 'testfile.log')
    ),
    fileTransport = new (winston.transports.File)({
      filename: path.join(__dirname, '..', 'fixtures', 'logs', 'testfilename.log')
    }),
    streamTransport = new (winston.transports.File)({ stream: stream }),
    metaTransport = new (winston.transports.File)({
      filename: path.join(__dirname, '..', 'fixtures', 'logs', 'testfilename.log'),
      addMeta: testMetadata 
    });

vows.describe('winston/transports/file').addBatch({
  "An instance of the File Transport": {
    "when passed a valid filename": {
      "should have the proper methods defined": function () {
        helpers.assertFile(fileTransport);
      },
      "the log() method": helpers.testNpmLevels(fileTransport, "should respond with true", function (ign, err, logged) {
        assert.isNull(err);
        assert.isTrue(logged);
      })
    },
    "when passed a valid file stream": {
      "should have the proper methods defined": function () {
        helpers.assertFile(streamTransport);
      },
      "the log() method": helpers.testNpmLevels(streamTransport, "should respond with true", function (ign, err, logged) {
        assert.isNull(err);
        assert.isTrue(logged);
      })
    },
    "with addMeta": {
      "should log the additional metadata": function () {
        sinon.spy(common, 'log');
        metaTransport.log('info', 'Test', {}, function () {
          assert.deepEqual(common.log.getCall(0).args[0].meta, testMetadata);
          common.log.restore();
        });
      }
    }
  }
}).addBatch({
  "These tests have a non-deterministic end": {
    topic: function () {
      setTimeout(this.callback, 200);
    },
    "and this should be fixed before releasing": function () {
      assert.isTrue(true);
    }
  }
}).addBatch({
  "An instance of the File Transport": transport(winston.transports.File, {
    filename: path.join(__dirname, '..', 'fixtures', 'logs', 'testfile.log')
  })
}).export(module);
