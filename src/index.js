'use strict'

const createModel = require('./create-model')
const buildPartialModel = require('./build-partial-model')
const ModelValidationError = require('./model-validation-error')
const types = require('./types')
const symbols = require('./symbols')

exports.ModelValidationError = ModelValidationError
exports.RawSymbol = symbols.Raw

exports.partial = buildPartialModel

exports.types = types
exports.raw = model => model[symbols.Raw]

exports.createModel = (...args) => {
  const Model = createModel(...args)

  Model.Partial = buildPartialModel(Model)

  return Model
}
