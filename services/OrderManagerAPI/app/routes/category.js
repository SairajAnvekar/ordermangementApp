const passport = require('passport'),
      config = require('@config'),
      models = require('@OrderManager/app/setup');      
module.exports = (app) => {
  const api = app.OrderManagerAPI.app.api.category;
  app.route('/api/v1/category')
     .get(passport.authenticate('jwt', config.session),  api.index(models.Category, app.get('budgetsecret')));
  app.route('/api/v1/category')
     .post(api.add(models.Category));
  app.route('/api/v1/category/delete')
  .put(api.deleteCat(models.Category,models.Product));     
}