const models = require('@OrderManager/app/setup');
var path = require('path');
module.exports = (app) => {
  const api = app.OrderManagerAPI.app.api.auth;
  app.route('/')
     .get((req, res) =>{ console.log(path.resolve(__dirname + '../../../../../Application/'));res.sendFile(path.resolve(__dirname + '../../../../../Application/dist/index.html'))});
  app.route('/api/v1/auth')
    .post(api.login(models.User));
}