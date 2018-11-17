const passport = require('passport'),
      config = require('@config'),
      models = require('@OrderManager/app/setup');
module.exports = (app) => {
  const api = app.OrderManagerAPI.app.api.order;
  app.route('/api/v1/order')
     .get(passport.authenticate('jwt', config.session),  api.index(models.Order, app.get('budgetsecret')));
  app.route('/api/v1/Order')
     .post(api.add(models.Order,models.Counter));
     app.route('/api/v1/setup/ordercounter')
     .post(api.setupCounter(models.Counter));
  app.route('/api/v1/Order')
     .put(api.edit(models.Order));
   app.route('/api/v1/Order/delete')
     .put(api.delete(models.Order));
       
}