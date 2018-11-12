const passport = require('passport'),
      config = require('@config'),
      models = require('@OrderManager/app/setup');
module.exports = (app) => {
  const api = app.OrderManagerAPI.app.api.product;
  app.route('/api/v1/product')
     .get(passport.authenticate('jwt', config.session),  api.index(models.Product, app.get('budgetsecret')));
  app.route('/api/v1/product')
     .post(api.add(models.Product));
  app.route('/api/v1/product')
  .put(api.edit(models.Product));    
  app.route('/api/v1/product/delete')
  .put(api.deleteProduct(models.Product)); 
  
}