const { getUserId } = require("../../utils");

function CurrentUser(parent, args, ctx, info) {
  const UserId = getUserId(ctx);
  const where = {
    id: UserId,
  };
  return ctx.db.query.user({ where }, info);
}

module.exports = { CurrentUser };
