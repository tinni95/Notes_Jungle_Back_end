const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const validator = require("validator");
require("dotenv").config();

async function SignUp(parent, { displayName, email, password }, ctx, info) {
  const errors = [];
  if (!validator.isEmail(email)) {
    errors.push({ message: "email is invalid." });
  }
  if (
    validator.isEmpty(password) ||
    !validator.isLength(password, { min: 5 })
  ) {
    errors.push({ message: "password too short." });
  }
  if (validator.isEmpty(displayName)) {
    errors.push({ message: "invalid display name." });
  }
  if (errors.length > 0) {
    const error = new Error("invalid input");
    error.data = errors;
    error.code = 422;
    throw error;
  }

  const where = {
    email,
  };
  const existingUser = await ctx.db.query.users({ where });
  if (existingUser.length > 0) {
    const error = new Error("user exists");
    throw error;
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

  const token = jwt.sign({ userId: user.id }, process.env.JWTSecret, {
    expiresIn: "1h",
  });
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
    const error = new Error("user not found");
    error.code = 401;
    throw error;
  }
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    const error = new Error("password is incorrect");
    error.code = 401;
    throw error;
  }
  const token = jwt.sign({ userId: user.id }, process.env.JWTSecret, {
    expiresIn: "1h",
  });
  return {
    token,
    user,
  };
}

module.exports = {
  SignIn,
  SignUp,
};
