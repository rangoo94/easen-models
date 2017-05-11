'use strict'

const createModel = require('./create-model')
const ValidationError = require('./validation-error')
const types = require('./types')
const symbols = require('./symbols')

exports.ValidationError = ValidationError
exports.RawSymbol = symbols.Raw

exports.createModel = createModel

exports.types = types
exports.raw = model => model[symbols.Raw]
