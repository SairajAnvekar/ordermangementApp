const mongoose = require('mongoose'),
      UserModel = require('@OrderManagerModels/user');
      productModel = require('@OrderManagerModels/product');
      categoryModel = require('@OrderManagerModels/category');
      
const models = {
  User: mongoose.model('User'),
  Product: mongoose.model('Product'),   
  Category: mongoose.model('Category') 
}
module.exports = models;