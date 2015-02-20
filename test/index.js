var test = require('tape')
var rimraf = require('rimraf')
var fs = require('fs')
var path = require('path')
var bepo = require('../')

var repoName = 'testRepo'
var temp = path.join(__dirname, 'tmp')
var a = path.join(temp, 'a')
var b = path.join(temp, 'b')
var c = path.join(temp, 'c')
var treeA = path.join(a, repoName)
var treeB = path.join(b, repoName)
var treeC = path.join(c, repoName)

var repoA, repoB, repoC

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

var settingsC = {
  worktree: treeC,
  email: 'bcomnes@gmail',
  name: 'Bret Comnes'
}

test('ensure clean directory', function(t) {
  if (fs.existsSync(temp)) {
    rimraf(temp, function(err) {
      t.error(err, 'tmp dir removed')
      t.end()
    })
  } else {
    t.pass('no temp dir exists')
    t.end()
  }
})

test('create bepo object', function(t) {
  repoA = bepo(settingsA)
  t.pass('Bepo a created!')
  repoB = bepo(settingsB)
  t.pass('Bepo b created!')
  repoC = bepo(settingsC)
  t.pass('Bepo C created! (no remote)')
  t.end()
})

test('create remote test repoA', function(t) {
  t.plan(1)
  repoA.init(function(err, stdout, stderr) {
    t.error(err, 'Initialize Repo A')
    repoA(['configure'])
  })
})

test('.clone', function(t) {
  t.plan(1)
  repoB.clone(function(err, stdout, stderr) {
    t.error(err, 'should be cloned now')
  })
})

test('.setUser', function(t) {
  t.plan(1)
  repoB.setUser(function(err) {
    t.error(err, 'user should be set now')
  })
})

test('.setEmail', function(t) {
  t.plan(1)
  repoB.setEmail(function(err) {
    t.error(err, 'user should be set now')
  })
})

test('.configure', function(t) {
  t.plan(3)
  repoA.configure(function(err) {
    t.error(err, 'should run all configure functions on A')
    repoA.config(['receive.denyCurrentBranch', 'ignore'], function(err) {
      t.error(err, 'repoA will accept pushes now')
    })
  })
  repoB.configure(function(err) {
    t.error(err, 'should run all configure functions on B')
  })
})

var newFile1 = path.join(treeA, 'hi.txt')
var newFile1Content = 'Hi this is the first file to commit'

test('create test content in A', function(t) {
  t.plan(1)
  fs.writeFile(newFile1, newFile1Content, function(err) {
    t.error(err, 'File should be created without error')
  })
})

test('Specifically stage newFile1 into repoA', function(t) {
  t.plan(1)
  repoA.add(newFile1, function(err, stdout, stderr) {
    t.error(err, 'newFile1 added to index')
    // console.log(stdout)
    // console.log(stderr)
  })
})

test('Commit newFile1 to repoA', function(t) {
  t.plan(1)
  repoA.commit('Added hello.txt', function(err, stdout, stderr) {
    t.error(err, 'hello.txt added')
    // console.log(stdout);
    // console.log(stderr);
  })
})

var newFile1Clone = path.join(treeB, path.basename(newFile1))
test('Pull repoA to repoB', function(t) {
  t.plan(3)
  repoB.pull(function(err, stdout, stderr) {
    t.error(err, 'RepoB pulled RepoA')

    // console.log(stdout);
    // console.log(stderr);

    fs.readFile(newFile1Clone, {
      encoding: 'utf8'
    }, function(err, data) {
        t.error(err, 'Should be error free')
        t.equal(data, newFile1Content, 'repoB is a clone of repoA')
      })
  })
})

var newFile2 = path.join(treeB, 'second.txt')
var newFile2Content = 'This content will be pused to repoA'

var newFile2Clone = path.join(treeA, path.basename(newFile2))
test('Manual push of repoB to repoA', function(t) {
  t.plan(7)
  fs.writeFile(newFile2, newFile2Content, function(err) {
    t.error(err, 'File should be created without error')

    repoB.add(newFile2, function(err, stdout, stderr) {
      t.error(err, 'newFile2 added to indexB')

      repoB.commit('Add second.txt to repoB', function(err, stdout, stderr) {
        t.error(err, 'second.txt added to repoB')

        repoB.push(function(err, stdout, stderr) {
          t.error(err, 'Sucessful push from repoB to repoA')

          repoA(['reset', '--hard'], function(err) {
            t.error(err, 'RepoA performed hard reset')
            fs.readFile(newFile2Clone, {
              encoding: 'utf8'
            }, function(err, data) {
                t.error(err, 'error free')
                t.equal(data, newFile2Content, 'repoA received repoB push')
              })
          })
        })
      })
    })
  })
})

var newFile3 = path.join(treeB, 'third.txt')
var newFile3Content = 'This should be a bit easier?'

test('.publish', function(t) {
  t.plan(2)
  fs.writeFile(newFile3, newFile3Content, function(err) {
    t.error(err, 'File should be created without error')
    repoB.publish(function(err, stdout, stderr) {
      t.error(err, 'publishing chain worked!')
    })
  })
})

test('.clone on remoteless Repo', function(t) {
  repoC.clone(function(err, stdout, stderr) {
    t.plan(2)
    t.ok(err.constructor === Error, 'should return an error')
    t.equal(err.message, 'No remote specified', 'Correct error message')
  })
})

test('clean up', function(t) {
  t.plan(1)
  rimraf(temp, function(err) {
    t.error(err, 'tests cleaned up')
  })
})
