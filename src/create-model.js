'use strict'

const ModelValidationError = require('./model-validation-error')
const symbols = require('./symbols')

/**
 * Build message from errors array
 *
 * @param {{ key: string, error: Error }[]} errors
 * @returns string
 */
function buildMessage (errors) {
  return `Model thrown validation error: ${buildDetails(errors)}`
}

/**
 * Build details information from errors array
 *
 * @param {{ key: string, error: Error }[]} errors
 * @returns string
 */
function buildDetails (errors) {
  return `${errors.map(error => error.key).join(', ')}`
}

/**
 * Build function which will set up getters & setters for model
 *
 * @param {object} definition
 * @param {string[]} keys
 * @returns {function}
 */
function buildSetup (definition, keys) {
  // Prepare list of functions which will set up getters & setters
  const setupFunctions = keys.map(key => (instance, data) => {
    Object.defineProperty(instance, key, {
      enumerable: true,
      configurable: true,
      get: () => data[key],
      set: value => {
        data[key] = definition[key](value)
        return data[key]
      }
    })
  })

  // Make single function to set up all in instance
  function setup (instance, data) {
    for (let i = 0; i < setupFunctions.length; i++) {
      setupFunctions[i](instance, data)
    }
  }

  return setup
}

/**
 * Create new model constructor
 * TODO: check if defineProperties is faster than defineProperty many times
 *
 * @param {object} definition
 * @returns {function}
 */
function createModel (definition) {
  // Copy object to be sure that nothing will reassign definition meanwhile
  definition = Object.assign({}, definition)

  // Memoize object keys for performance reasons
  const keys = Object.keys(definition)

  // Memoize property setup functions
  const setup = buildSetup(definition, keys)

  function Model (initialData) {
    // Prepare basic object for storing data
    const data = {}

    // Set up getters and setters
    setup(this, data)

    // Set single value and return it
    const set = (key, value) => {
      try {
        this[key] = value
      } catch (error) {
        return { key, error }
      }
    }

    // Set up property to get copy of raw data
    Object.defineProperty(this, symbols.Raw, {
      enumerable: false,
      get: () => Object.assign({}, data)
    })

    // Set up initial values & check for validation errors
    const errors = keys.map(key => set(key, initialData[key])).filter(Boolean)

    // Throw validation errors
    if (errors.length) {
      throw new ModelValidationError(buildMessage(errors), buildMessage(errors), errors)
    }
  }

  // Prepare factory to use it for initialization
  Model.create = initialData => new Model(initialData)
  Model.Definition = definition

  return Model
}

module.exports = createModel
