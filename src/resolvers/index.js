const _ = require("lodash");
const UniversityQuery = require("./queries/UniversityQueries");
const UserMutations = require("./mutations/UserMutations");

module.exports = {
  Query: UniversityQuery,
  Mutation: UserMutations,
};
