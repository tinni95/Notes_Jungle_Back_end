const jwt = require("jsonwebtoken");

function getUserId(context) {
  const Authorization = context.request.get("Authorization");
  if (Authorization) {
    const token = Authorization.replace("Bearer ", ""); // Authorization: Bearer asdasd
    const { userId } = jwt.verify(token, "124asdlkjoif1231");
    return userId;
  }
  throw new Error("Not authenticated");
}

module.exports = {
  getUserId,
};
