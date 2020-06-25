function UniversitySearch(parent, args, ctx, info) {
  const where = {
    title_contains: args.search,
  };
  return ctx.db.query.universities({ where }, info);
}
module.exports = { UniversitySearch };
