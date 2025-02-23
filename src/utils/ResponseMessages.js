

class ResponseMessageClass {
  /**
   * Returns success status code.
   * @param {Object} res - Response object.
   * @param {String} result - Result object.
   * @returns Success status code.
   */
  Success(res, result, next = null) {
    return next
      ? next({ status: 200, result: result })
      : res.status(200).json({ result: result, status: 200 })
  }

  SuccessBulk(res, message = null) {
    return res.status(200).json({
      result: { message: message || 'Successfully updated the items.' },
    })
  }

  /**
   * Returns a 400 Bad Request response with an error message.
   * @param {Object} res - Response object.
   * @param {String} message - Error message.
   * @param {String} errMessage - Error details.
   * @returns {Object} JSON response.
   */
  BadRequest(res, message, errMessage) {
    return res.status(400).json({
      message: message,
      error: errMessage,
    })
  }

  /**
   * Returns a 404 Not Found response with an error message.
   * @param {Object} res - Response object.
   * @param {String} message - Error message.
   * @param {String} errMessage - Error details.
   * @returns {Object} JSON response.
   */
  NotFound(res, message, errMessage) {
    return res.status(404).json({
      message: message,
      error: errMessage,
    })
  }

  /**
   * Returns a 401 Unauthorized response with an error message.
   * @param {Object} res - Response object.
   * @param {String} message - Error message.
   * @param {String} errMessage - Error details.
   * @returns {Object} JSON response.
   */
  Unauthenticated(res, message, errMessage) {
    return res.status(401).json({
      message: message,
      error: errMessage,
      result: [],
    })
  }

  /**
   * Returns a 403 Forbidden response with an error message.
   * @param {Object} res - Response object.
   * @param {String} message - Error message.
   * @param {String} errMessage - Error details.
   * @param {Boolean} redirect - Redirect to login page.
   * @returns {Object} JSON response.
   */
  Unauthorized(res, message, errMessage, redirect = false) {
    return res.status(403).json({
      message: message,
      error: errMessage,
      result: [],
      redirect,
    })
  }

  /**
   * Returns a 500 Internal Server Error response with an error message.
   * @param {Object} res - Response object.
   * @param {String} message - Error message.
   * @param {String} errMessage - Error details.
   * @returns {Object} JSON response.
   */
  InternalServerError(res, message, errMessage) {
    return res.status(500).json({
      message: message,
      error: errMessage,
    })
  }

  /**
   * Checks if the id parameter is valid.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {boolean} - Returns true if the id is valid, false otherwise.
   */
  IdIsValid(req, res, next) {
    if (req.params.id == null) {
      this.BadRequest(
        res,
        'Id was not provided',
        'Error: Id is required but no value was provided.'
      )
      return false
    } else if (isNaN(req.params.id)) {
      this.BadRequest(res, 'Id must be a number', 'Error: Id must be a number.')

      return false
    }
    return true
  }

  /**
   * Checks if the id parameter is valid.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {boolean} - Returns true if the id is valid, false otherwise.
   */
  IdIsValidSearchQuery(value, res) {
    if (value == null) {
      this.BadRequest(
        res,
        'Id was not provided in the search query',
        'Error: Id is required but no value was provided.'
      )
      return false
    } else if (isNaN(value)) {
      this.BadRequest(res, 'Id must be a number', 'Error: Id must be a number.')

      return false
    }
    return true
  }

  /**
   * Checks if the id parameter is valid.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {boolean} - Returns true if the id is valid, false otherwise.
   */
  BulkIdIsValid(req, res, next) {
    return req.body.every((item) => {
      if (item.id === null) {
        this.BadRequest(
          res,
          'Id was not provided',
          'Error: Id is required but no value was provided.'
        )
        return false
      } else if (isNaN(item.id)) {
        this.BadRequest(
          res,
          'Id must be a number',
          `Error: Id must be a number. The value ${item.id} is not a number.`
        )
        return false
      }
      return true
    })
  }

  BulkDataIsValid(req, res, next) {
    if (req.body === null) {
      this.BadRequest(
        res,
        'Data was not provided',
        'Error: Data is required but no value was provided.'
      )
      return false
    } else if (!Array.isArray(req.body)) {
      this.BadRequest(
        res,
        'Data must be an array',
        'Error: Data must be an array.'
      )

      return false
    } else if (req.body.length === 0) {
      this.BadRequest(
        res,
        'Data cannot be empty',
        'Error: Data cannot be empty.'
      )
      return false
    }
    return true
  }

  /**
   * Checks the error code if it matches 207 and returns a specific error message.
   * @param {Object} req - The request object.
   * @param {Number} errNum - The error code.
   * @param {String} column - The column name.
   * @returns {boolean} - Returns false if the error code is 207, true otherwise.
   */
  ColumnExists(res, errNum, column) {
    if (errNum === 207) {
      this.NotFound(res, `Column does not exist.`)

      res.status(404).json({
        result: [],
        message: `Column does not exist.`,
        error: `Error: Column '${column}' does not exist`,
      })

      return false
    }
    return true
  }

  /**
   * Checks if the column and value parameters are not null or undefined.
   * @param {Object} res - The response object.
   * @param {String} column - The column name.
   * @param {String} value - The value.
   * @param {String} colMessage - Optional column error message.
   * @param {String} valMessage - Optional value error message.
   * @returns {boolean} - Returns false if the column or value is null or undefined, true otherwise.
   */
  ColumnValuePairIsNotNull(res, column, value, colMessage, valMessage) {
    // Column is null return 400 status code
    if (column === null || column === undefined) {
      this.BadRequest(
        res,
        colMessage
          ? colMessage
          : "Please ensure that you use 'column' as the key for the column data",
        'Error: No column provided'
      )

      return false
    }
    // Value is null return 400 status code
    else if (value === null || value === undefined) {
      this.BadRequest(
        res,
        valMessage ? valMessage : 'Please ensure that you provided a value',
        'Error: No value provided'
      )

      return false
    } else {
      return true
    }
  }

  /**
   * Logs an error to the console and returns a JSON error response.
   * @param {Object} res - The response object.
   * @param {String} error - The error message.
   * @returns A 400 status code if the error contains "must be a valid" substring otherwise it will return a 500 status code with the error message.
   */
  Error(res, error, payload) {
    console.log(error)
    // Invalid data sent to the server return a 400 status code
    if (
      error.message.includes('must be a valid') ||
      error.message.includes('must be a non-empty string') ||
      error.message.includes('must be an integer')
    )
      return res.status(400).json({
        error: error.message,
        result: payload ? payload : [],
        message: 'Invalid data sent to server.',
      })

    if (error.message.includes('Violation of UNIQUE KEY'))
      return res.status(400).json({
        error: error.message,
        result: payload ? payload : ['Duplicate Detected'],
        message: 'Duplicate key value violates unique constraint.',
        duplicate: true,
      })
    return res.status(500).json({
      error: error.message,
      result: payload ? payload : [],
      message: 'Result not found.',
    })
  }
}

module.exports = new ResponseMessageClass
