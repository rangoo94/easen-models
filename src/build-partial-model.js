'use strict'

const symbols = require('./symbols')
const optional = require('./types').optional
const createModel = require('./create-model')

/**
 * Build partial model from normal one
 *
 * @param {function} InitialModel
 * @returns {Function}
 */
function buildPartialModel (InitialModel) {
  const definition = InitialModel.Definition

  const partialDefinition = {}

  // Pass all definitions as optional
  const keys = Object.keys(definition)

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    partialDefinition[key] = optional.pass(definition[key])
  }

  // Build model from partial definition
  const Model = createModel(partialDefinition)

  // Build native method which will parse object to JSON without undefined values
  Model.prototype.toJSON = function () {
    const data = this[symbols.Raw]

    // Delete unneeded keys
    const keys = Object.keys(data)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]

      if (data[key] === undefined) {
        delete data[key]
      }
    }

    return data
  }

  return Model
}

module.exports = buildPartialModel
