var request = require('supertest'),
    app = require('../server.js'),
    assert = require('assert'),
    body_parser = require('body-parser');

describe('GET /', function() {
  it('respond with required params', function(done) {
    app.use(body_parser.json());
    request(app).get('/')
                .expect(function(res){
                  assert.ifError(res.error);
                })
                .expect(200, done);
  });
});
