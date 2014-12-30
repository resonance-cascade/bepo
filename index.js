// bepo.js

var url = require('url');
var fs = require('fs');
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

  function config(options, cb) {
    var configStr = ['config'].concat(options || []);
    git(configStr, cb);
  }
  self.config = config;

  function setUser(cb) {
    config(['user.name', obj.name || 'bepo user'], cb);
  }
  self.setUser = setUser;

  function setEmail(cb) {
    config(['user.email', obj.email], cb)
  }
  self.setEmail = setEmail;

  function configure(cb) {
    series([
      setUser,
      setEmail
    ], cb)
  }
  self.configure = configure;

  function add(files, cb) {
    var addFiles = ['add'].concat(files || ['-A'])
    git(addFiles, cb);
  }
  self.add = add;

  function commit(msg, cb) {
    git(['commit', '-m', msg], cb)
  }
  self.commit = commit;

  function push(cb) {
    git(['push', 'origin', 'master'], cb)
  }
  self.push = push;

  function publish(cb) {
    series([
      pull,
      add.bind(self, ['-A']),
      commit.bind(self, "'bebo made a commit'"),
      push
    ], cb)
  }
  self.publish = publish;

  return self;
}

module.exports = repo;
