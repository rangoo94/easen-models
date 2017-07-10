'use strict'

const ModelValidationError = require('./model-validation-error')

// Set up helper functions to make code semantic

const combine = (...functions) => value => functions.reduce((v, f) => f(v), value)
const not = func => (...args) => !func(...args)
const isOneOf = arr => value => arr.includes(value)

exports.combine = combine
exports.not = not

/**
 * Combine few functions creating validator
 *
 * @param {function} f
 * @returns {function}
 */
function pass (f) {
  const f2 = (value, stop) => f(value, stop)

  f2.assert = (...args) => f2.pass(assert(...args))

  f2.pass = next => pass(x => {
    let isStopped = false

    const stop = x => {
      isStopped = true
      return x
    }

    const result = f(x, stop)

    return isStopped ? result : next(result)
  })

  return f2
}

exports.pass = pass

/**
 * Assert if function result is truthy
 *
 * @param {function} func
 * @param {string} message
 * @param {function} [ErrorClass]
 * @returns {function}
 * @throws Error
 */
function assert (func, message, ErrorClass = ModelValidationError) {
  return pass(value => {
    if (!func(value)) {
      throw new ErrorClass(message)
    }

    return value
  })
}

exports.assert = assert

// Set up some generic rules

const optional = pass((value, stop) => value === undefined ? stop(undefined) : value)
const empty = assert(v => v == null, 'Value should be empty').pass(v => null)
const required = assert(v => v != null, 'Value should not be empty')
const oneOf = arr => assert(isOneOf, 'Should be one of values from list')
const notOneOf = arr => assert(not(isOneOf), 'Shouldn\'t be one of values from list')

exports.optional = optional
exports.empty = empty
exports.required = required
exports.oneOf = oneOf
exports.notOneOf = notOneOf

// Set up some basic validations

const isValidNumber = not(isNaN)
const isValidDate = date => new Date(date).toString() !== 'Invalid Date'

// Set up some basic types

const any = pass(x => x)
const number = pass(Number).pass(assert(isValidNumber, 'Incorrect number'))
const integer = number.assert(v => parseInt(v, 10) === v, 'Incorrect integer')
const date = pass(v => new Date(v)).assert(isValidDate)
const string = pass(String)
const bool = pass(Boolean)
const object = assert(x => (x && typeof x === 'object'), 'Incorrect object')

exports.any = any
exports.number = exports.decimal = number
exports.integer = exports.int = integer
exports.date = date
exports.string = string
exports.boolean = exports.bool = bool
exports.object = object

// Set some decorators which can't go deeper

const defaultValue = (f, def) => (...args) => {
  if (args[0] == null) {
    return def
  }

  return f(...args)
}

const nullable = f => defaultValue(f, null)

const arrayOf = f => arr => {
  if (!Array.isArray(arr)) {
    throw new ModelValidationError('It should be array')
  }

  return arr.map(value => f(value))
}

const instanceOf = Cls => value => new Cls(value)

exports.default = defaultValue
exports.nullable = nullable
exports.arrayOf = arrayOf
exports.instanceOf = instanceOf
