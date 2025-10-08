/**
 * Send a standardized API response
 * 
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {boolean} success - true if request succeeded, false otherwise
 * @param {object|array|null} payload - the data to return on success
 * @param {string} message - human-readable message
 * @param {object|null} errors - optional field-level validation errors
 */
const sendResponse = (res, statusCode = 200, success = true, payload = null, message = '', errors = null) => {
    const response = { success, message };

    if (payload !== null) response.payload = payload;
    if (errors !== null) response.errors = errors;
    if (statusCode !== null) response.statusCode = statusCode;

    return res.status(statusCode).json(response);
};

module.exports = { sendResponse };