/**
 * Controller for Hello API endpoint
 * Single Responsibility: Handling the /api/hello response payload
 */
const getHello = (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Hello World from Node.js API',
  });
};

module.exports = {
  getHello,
};
