const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

async function SignUp(parent, { displayName, email, password }, ctx, info) {
  const where = {
    email,
  };
  const check = await ctx.db.query.users({ where });
  if (check.length > 0) {
    return new Error("User already exists with that email");
  }

  const encryptedPassword = await bcrypt.hash(password, 10);
  const user = await ctx.db.mutation.createUser(
    {
      data: {
        displayName,
        email,
        password: encryptedPassword,
      },
    },
    `{id}`
  );

  const token = jwt.sign({ userId: user.id }, process.env.JWTSecret);
  return {
    token,
    user,
  };
}

async function SignIn(parent, { email, password }, ctx, info) {
  const user = await ctx.db.query.user(
    {
      where: {
        email,
      },
    },
    `{id password}`
  );
  if (!user) {
    throw new Error("No such a user");
  }
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw new Error("Invalid password");
  }
  const token = jwt.sign({ userId: user.id }, process.env.JWTSecret);
  return {
    token,
    user,
  };
}

module.exports = {
  SignIn,
  SignUp,
};
