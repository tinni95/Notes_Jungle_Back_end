const jwt = require("jsonwebtoken");
require("dotenv").config();

function getUserId(context) {
  const Authorization = context.request.get("Authorization");
  if (Authorization) {
    const token = Authorization.replace("Bearer ", ""); // Authorization: Bearer asdasd
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    return userId;
  }
  const error = new Error("Not authenticated");
  error.code = 403;
  throw error;
}

module.exports = {
  getUserId,
};
