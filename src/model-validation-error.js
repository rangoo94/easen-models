'use strict'

/**
 * Error to show validation
 *
 * @class
 */
class ModelValidationError extends Error {
  /**
   * @param {string} message
   * @param {string} details
   * @param {{ key: string, error: Error }[]} [errors]
   * @constructor
   */
  constructor (message, details, errors = []) {
    super(message)

    // Set up some properties
    this.name = this.constructor.name
    this.list = errors && errors.length ? errors : null
    this.details = details || null

    // Set proper error stack trace
    Error.captureStackTrace(this, this.constructor)
  }

  toJSON () {
    return {
      message: this.message,
      details: this.details,
      list: this.list || undefined
    }
  }
}

module.exports = ModelValidationError
