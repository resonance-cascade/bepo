DEPRECIATED PROJECT

bepo
====

[![npm version](https://badge.fury.io/js/bepo.svg)](https://www.npmjs.com/package/bepo)
[![Build Status](https://travis-ci.org/bcomnes/bepo.svg)](https://travis-ci.org/bcomnes/bepo)
[![Test Coverage](https://codeclimate.com/github/bcomnes/bepo/badges/coverage.svg)](https://codeclimate.com/github/bcomnes/bepo)
[![Code Climate](https://codeclimate.com/github/bcomnes/bepo/badges/gpa.svg)](https://codeclimate.com/github/bcomnes/bepo)

(WIP) High level git workflow automation with a focus on repositories containing blog posts.

Bepo can stage all your changes, commit them to master, and push them off to your server/gh-pages for building.... All in a single method call!  Wow!

## Example

```js
var bepo = require('bepo')
var fs = require('fs')
var path = require('path')

var repoPath = '/path/to/repo'
var repoSettings = {
  worktree: repoPath,
  email: 'person@example.com',
  name: 'Cool Person',
  remote: 'git@github.com:person/.github.io.git'
}

var repo = bepo(repoSettings);

repo.clone(function(err, stdout, stderr) {
  if (err) throw(err)
  console.log('The repo is now cloned!')

  fs.writeSync(path.join(repoPath, 'new_post.md'), 'hi this is my new blogpost')

  repo.publish(function(err, stdout, stderr) {
    if (err) throw(err)

    console.log('new_post is committed, and pushed to remote!')
    })
})

```
## Methods

`bepo` is a high level api that wraps `quick-gits` that wraps child process.

### `var repo = require('bepo')(settings)`

Create a new bepo object with a settings object:

#### `settings`

The settings object can have the following properties:

- `worktree`: Path to where the repository should live.
- `email`: The email address you want the repository to have
- `name`: The name of the commit user
- `remote`: The URL of the default remote.

### `.init(cb)`

### `.clone(cb)`

### `.publish(cb)`

### `.pull(cb)`

### `.configure(cb)`

### `.setUser(cb)`

### `.setEmail(cb)`

### `.commit(msg, cb)`

### `.push(cb)`
