'use strict'

/**
 * Error to show validation
 *
 * @class
 */
class ModelValidationError extends Error {
  /**
   * @param {string} message
   * @param {{ key: string, error: Error }[]} [errors]
   * @constructor
   */
  constructor (message, errors = []) {
    super(message)

    // Set up some properties
    this.name = this.constructor.name
    this.list = errors

    // Set proper error stack trace
    Error.captureStackTrace(this, this.constructor)
  }
}

module.exports = ModelValidationError
