/*
 * console-test.js: Tests for instances of the Console transport
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENSE
 *
 */

var path = require('path'),
    vows = require('vows'),
    assert = require('assert'),
    winston = require('../../lib/winston'),
    common = require('../../lib/winston/common'),
    sinon = require('sinon'),
    helpers = require('../helpers');

var testMetadata = { meta: 'data' };

var npmTransport = new (winston.transports.Console)(),
    syslogTransport = new (winston.transports.Console)({ levels: winston.config.syslog.levels }),
    metaTransport = new (winston.transports.Console)({ addMeta: testMetadata });

vows.describe('winston/transports/console').addBatch({
  "An instance of the Console Transport": {
    "with npm levels": {
      "should have the proper methods defined": function () {
        helpers.assertConsole(npmTransport);
      },
      "the log() method": helpers.testNpmLevels(npmTransport, "should respond with true", function (ign, err, logged) {
        assert.isNull(err);
        assert.isTrue(logged);
      })
    },
    "with syslog levels": {
      "should have the proper methods defined": function () {
        helpers.assertConsole(syslogTransport);
      },
      "the log() method": helpers.testSyslogLevels(syslogTransport, "should respond with true", function (ign, err, logged) {
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
}).export(module);
