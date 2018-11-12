const mongoose = require('mongoose'),
      bcrypt = require('bcrypt');

const Schema = mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category_id: {
        type: String,
        required: true
    },
    catCode:String,
    code: String,
    price:Number,
    hasSize:Boolean,
    size:{
        height: Number,
        width: Number,
        rate: Number,
    }
}); 


mongoose.model('Product', Schema);