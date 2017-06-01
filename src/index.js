'use strict'

const createModel = require('./create-model')
const ModelValidationError = require('./model-validation-error')
const types = require('./types')
const symbols = require('./symbols')

exports.ModelValidationError = ModelValidationError
exports.RawSymbol = symbols.Raw

exports.createModel = createModel

exports.types = types
exports.raw = model => model[symbols.Raw]
