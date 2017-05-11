'use strict'

/**
 * Error to show validation
 *
 * @class
 */
class ValidationError extends Error {
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
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor)
    } else {
      this.stack = (new Error(message)).stack
    }
  }
}

module.exports = ValidationError
