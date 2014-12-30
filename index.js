// bepo.js

var url = require('url');
var fs = require('fs');
var debug = require('debug')('lib:bepo');
var series = require('array-series');
var gits = require('quick-gits');



// Pass in the settings to get a new Repo object
function repo(obj) {
  var git = gits(obj.worktree);
  var self = git;
  // Its this or mucking with superclass

  var gitClone = self.clone;

  function clone(cb) {
    if (obj.remote) {
      gitClone.bind(self, obj.remote)(cb)
    } else {
      cb(new Error("No remote specified"));
    } // TODO new Error then cb(err);
  }
  self.clone = clone;

  function pull(cb) {
    git(['pull'], {
      timeout: 15000
    }, cb);
  }
  self.pull = pull;

  function setUser(cb) {
    git(['config', 'user.name', obj.name || 'bepo user'], cb)
  }
  self.setUser = setUser;

  function setEmail(cb) {
    git(['config', 'user.email', obj.email], cb)
  }
  self.setEmail = setEmail;

  function add(files, cb) {
    var addFiles = ['add'].concat(files || ['-A'])
    git(addFiles, cb);
  }
  self.add = add;

  return self;
}

module.exports = repo;
