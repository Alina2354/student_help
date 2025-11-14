function formatResponse(statusCode, message, data = null, error = null) {
  return {
    statusCode,
    message,
    data, // если не придет будет null
    error, // если не придет будет null
  };
}
module.exports = formatResponse;
