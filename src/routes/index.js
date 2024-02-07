module.exports = (app) => {
  app.use("/user", require("./user.routes"));
  app.use('/corporate', require('./corporate.routes'))
  app.use('/solution', require('./solution.routes'))
};
