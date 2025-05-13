module.exports = (app) => {
  app.use("/user", require("./user.routes"));
  app.use('/corporate', require('./corporate.routes'))
  app.use('/solution', require('./solution.routes'))
  app.use('/freelance', require('./freelance.routes'))
  app.use('/service', require('./service.routes'))
  app.use('/manual', require('./manual.routes'))
  app.use('/file', require('./file.routes'))
  app.use('/search', require('./search.routes'))
  app.use('/certification', require('./certification.routes'))
  app.use('/favorite', require('./favorite.routes'))
  app.use('/image', require('./image.routes'))
  app.use('/event', require('./event.routes'))
  app.use('/blog', require('./blog.routes'))
  app.use('/reference', require('./reference.routes'))
  app.use('/entity-plans', require('./entity-plan.routes'))
};


