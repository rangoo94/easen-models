# Easen Models

[![Travis](https://travis-ci.org/rangoo94/easen-models.svg)](https://travis-ci.org/rangoo94/easen-models)
[![Code Climate](https://codeclimate.com/github/rangoo94/easen-models/badges/gpa.svg)](https://codeclimate.com/github/rangoo94/easen-models)
[![Coverage Status](https://coveralls.io/repos/github/rangoo94/easen-models/badge.svg?branch=master)](https://coveralls.io/github/rangoo94/easen-models?branch=master)

Project is not ready yet, see **To do** list on the bottom.

## How to use

### Create your first model

Firstly, you have to create your own model:

```js
const { createModel, types: t } = require('easen-models')

const Post = createModel({
  id: t.int,
  title: t.string,
  published: t.bool,
  createdAt: t.date,
  updatedAt: t.date
})
```

### Use model

Secondly, just create instance of this model:

```js
const post = new Post({
  id: '10',
  title: 'Post title',
  published: 1,
  createdAt: '2017-01-01T15:00:00',
  updatedAt: Date.now()
})
```

### Handle validation errors

In case of current types, values will be transformed to correct type (e.g. `id` to `int`).
When something will be wrong, `ValidationError` will be thrown, so you can handle errors:

```js
const { ValidationError } = require('easen-models')

try {
  const post = new Post({
    id: '10',
    title: 'Post title',
    published: 1,
    createdAt: '2017-01-01T15:00:00',
    updatedAt: Date.now()
  })
} catch (e) {
  if (e instanceof ValidationError) {
    // Some values are wrong, you can look at additional errors at e.list
  } else {
    // Rethrow errors not connected to validation
    throw e
  }
}
```

### Prepare your own validators

Behind the scenes, models are trying to instantiate values and checks for errors.
Let see some examples of preparing your own validators:

```js
const { createModel, types: t } = require('easen-models')

const Post = createModel({
  id: t.int.assert(v => v < 10, 'ID must be smaller than 10'),
  title: t.string.pass(v => v.toUpperCase()),
  published: t.assert(v => v === true, 'Post must be published'),
  likesPercentage: t.pass(parseFloat).pass(v => v * 100),
  slug: v => ('' + v).toLowerCase().replace(/[^a-z]/g, '-')
})
```

Validators/types are just simple functions, which can throw error. It means, that you can use any other libraries to use there.
When Model will detect error thrown, it will throw `ValidationError`.

Alternatively, you can use simple syntax with `pass` & `assert` helpers. Every validation included in `easen-models` allow chaining by default.
`pass` is just passing a value to next function, `assert` will make assertion (check if passed function results with truthy value) and throw error if not.
You can use these methods as many times in chain you want.

### Updating object

You have to simply update a value - it will be automatically transformed. Everything is using getters & setters:

```js
const { createModel, types: t } = require('easen-models')

const Post = createModel({
  id: t.int,
  title: t.string,
  published: t.bool,
  createdAt: t.date,
  updatedAt: t.date
})

const post = new Post({
  id: '10',
  title: 'Post title',
  published: 1,
  createdAt: '2017-01-01T15:00:00',
  updatedAt: Date.now()
})

console.log(post.createdAt) // instance of Date, 2017-01-01T15:00:00.000Z

post.createdAt = '2015-01-01'
console.log(post.createdAt) // instance of Date, 2015-01-01T00:00:00.000Z
```

### Getting raw object

You've got two options to get copy of raw object - using symbol or using built-in function:

```js
const { raw } = require('easen-models')
const value = raw(post)

const { RawSymbol } = require('easen-models')
const value = post[RawSymbol]
```

If you want to serialize object, you can simply use just `JSON.stringify`

## Development

[Mocha](http://mochajs.org) with [Expect.js](https://github.com/Automattic/expect.js) are used for tests, with [Wallaby](http://wallabyjs.com) as additional runner for development.
Code style standard is [StandardJS](http://standardjs.com).

### To do

- Write unit tests
- Extend description, improve documentation
- Write `oneOfType` validator
- Prepare table with available validators in README file
