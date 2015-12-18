'use strict';

const Foso = require('foso');
const js = require('fosify-js');
const less = require('fosify-less');
const Server = require('foso-cdn').Server;
const path = require('path');

module.exports = function(cb) {
  var opts = {
    dest: path.resolve(__dirname, '../dist'),
    src: path.resolve(__dirname, '../'),
    serve: false,
  };

  var foso = new Foso();
  foso
    .register([js, less], opts)
    .then(() => foso.bundle())
    .then(function() {
      var server = new Server({
        src: path.resolve(__dirname, '../'),
      });
      return server.start();
    })
    .then(cb)
    .catch(cb);
};