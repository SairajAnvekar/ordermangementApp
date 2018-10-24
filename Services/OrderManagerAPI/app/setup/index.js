const mongoose = require('mongoose'),
      UserModel = require('@OrderManagerModels/user');
     
      
const models = {
  User: mongoose.model('User'),  
}
module.exports = models;