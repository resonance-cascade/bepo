var test = require('tape');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var fs = require('fs');
var path = require('path');
var bepo = require('../');

var repoName = 'testRepo';
var temp = path.join(__dirname, 'tmp')
var a = path.join(temp, 'a')
var b = path.join(temp, 'b')
var treeA = path.join(a, repoName)
var treeB = path.join(b, repoName)

var repoA, repoB;

var settingsA = {
  worktree: treeA,
  email: 'bcomnes@gmail',
  name: 'Bret Comnes',
  remote: treeB
}

var settingsB = {
  worktree: treeB,
  email: 'bcomnes@gmail',
  name: 'Bret Comnes',
  remote: treeA
}

test("ensure clean directory", function(t) {
  if (fs.existsSync(temp)) {
    rimraf(temp, function(err) {
      t.error(err, 'tmp dir removed');
      t.end();
    })
  } else {
    t.pass('no temp dir exists');
    t.end()
  }
})

test("create bepo object", function(t) {
  repoA = bepo(settingsA);
  t.pass("Bepo a created!");
  repoB = bepo(settingsB);
  t.pass("Bepo b created!");
  t.end();
})

test("create remote test repoA", function(t) {
  t.plan(1);
  repoA.init(function(err, stdout, stderr) {
    t.error(err, 'Initialize Repo A');
  })
})

test(".clone", function(t) {
  t.plan(1);
  repoB.clone(function(err, stdout, stderr) {
    t.error(err, 'should be cloned now')
  })
})

test(".setUser", function(t) {
  t.plan(1);
  repoB.setUser(function(err) {
    t.error(err, 'user should be set now')
  });
});

test(".setEmail", function(t) {
  t.plan(1);
  repoB.setEmail(function(err) {
    t.error(err, 'user should be set now')
  });
});

test.skip(".config", function(t) {
  t.plan(1);
  repoB.config(function(err) {
    t.error(err, 'should run all config functions')
  })
})



test("clean up", function(t) {
  t.plan(1);
  rimraf(temp, function(err) {
    t.error(err, 'tests cleaned up')
  })
})
