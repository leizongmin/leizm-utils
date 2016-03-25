/**
 * lei-utils tests
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

const assert = require('assert');
const utils = require('../');

describe('promise', function () {

  describe('call', function () {

    it('passed callback - success', function (done) {

      function sleep(ms, msg, callback) {
        setTimeout(function () {
          callback(null, msg);
        }, ms);
      }

      utils.promise.call(sleep, 100, 'hello')
      .then(ret => {
        assert.equal(ret, 'hello');
        done();
      })
      .catch(done);

    });

    it('passed callback - error', function (done) {

      function sleep(ms, msg, callback) {
        setTimeout(function () {
          callback(new Error(msg));
        }, ms);
      }

      utils.promise.call(sleep, 100, 'hello')
      .then(ret => {
        done(new Error('must throws error'));
      })
      .catch(err => {
        assert.equal(err.message, 'hello');
        done();
      });

    });

    it('return promise - success', function (done) {

      function sleep(ms, msg, callback) {
        return new Promise((resolve, reject) => {
          setTimeout(function () {
            resolve(msg);
          }, ms);
        });
      }

      utils.promise.call(sleep, 100, 'hello')
      .then(ret => {
        assert.equal(ret, 'hello');
        done();
      })
      .catch(done);

    });

    it('return promise - success', function (done) {

      function sleep(ms, msg, callback) {
        return new Promise((resolve, reject) => {
          setTimeout(function () {
            reject(new Error(msg));
          }, ms);
        });
      }

      utils.promise.call(sleep, 100, 'hello')
      .then(ret => {
        done(new Error('must throws error'));
      })
      .catch(err => {
        assert.equal(err.message, 'hello');
        done();
      });

    });

  });

});
