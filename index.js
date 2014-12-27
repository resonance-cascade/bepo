// bepo.js

var url = require('url');
var fs = require('fs');
var debug = require('debug')('lib:bepo');
var series = require('array-series');
var gits = require('quick-git');

// Pass in the settings to get a new Repo object
function Repo(obj) {
  var self;
  var git = gits(obj.worktree);
  self = git;

  function clone(cb) {
    if (obj.remote) git.clone(obj.remote, cb);
    else; // TODO new Error then cb(err);
  };
  self.clone = clone;

  function pull(cb) {
    git(['pull'], {
      timeout: 15000
    }, cb);
  };
  self.pull = pull;

  function setUser(cb) {
    git(['config', 'user.name', obj.name || 'bepo user'], cb)
  };
  self.setUser = setUser;

  function setEmail(cb) {
    git(['config', 'user.email', obj.email], cb)
  };
  self.setEmail = setEmail;

  function add(files, cb) {
    var add = ['add'].concat(files || ['-A'])
    git(add, cb);
  };
  self.add = add;

  return self;
}
