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
var aTree = path.join(a, repoName)
var bTree = path.join(b, repoName)

var repoA, repoB;

var aSettings = {
  worktree: aTree,
  email: 'bcomnes@gmail',
  name: 'Bret Comnes',
  repo: bTree
}

var bSettings = {
  worktree: bTree,
  email: 'bcomnes@gmail',
  name: 'Bret Comnes',
  repo: aTree
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

test("create tmp folders", function(t) {
  t.plan(2);
  mkdirp(a, function(err) {
    t.error(err, 'a dir created');
    mkdirp(b, function(err) {
      t.error(err, 'b dir created');
    })
  })
})

test.skip("create remote test repoA", function(t) {
  t.plan(1);
  cp.exec('git init ' + aTree, function(err, stdout, stderr) {
    t.error(err, 'initialzed test repo');
    aRepo = new Repo(aSettings)
  })
})

test.skip("create repo object", function(t) {
  t.plan(1);
  bRepo = new Repo(bSettings);
  t.pass('repo object created')
})

test.skip(".clone", function(t) {
  t.plan(1);
  bRepo.clone(function(err) {
    t.error(err, 'should be cloned now')
  })
})

test.skip(".setUser", function(t) {
  t.plan(1);
  bRepo.setUser(function(err) {
    t.error(err, 'user should be set now')
  });
});

test.skip(".setEmail", function(t) {
  t.plan(1);
  bRepo.setEmail(function(err) {
    t.error(err, 'user should be set now')
  });
});

test.skip(".config", function(t) {
  t.plan(1);
  bRepo.config(function(err) {
    t.error(err, 'should run all config functions')
  })
})



test("clean up", function(t) {
  t.plan(1);
  rimraf(temp, function(err) {
    t.error(err, 'tests cleaned up')
  })
})
