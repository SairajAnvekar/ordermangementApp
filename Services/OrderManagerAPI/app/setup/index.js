const mongoose = require('mongoose'),
      UserModel = require('@OrderManagerModels/user');
      productModel = require('@OrderManagerModels/product');
      categoryModel = require('@OrderManagerModels/category');
      OrderModel = require('@OrderManagerModels/order');
      CounterModel = require('@OrderManagerModels/counter');
      
const models = {
  User: mongoose.model('User'),
  Product: mongoose.model('Product'),   
  Category: mongoose.model('Category'),
  Order: mongoose.model('Order'),
  Counter: mongoose.model('Counters')
}
module.exports = models;