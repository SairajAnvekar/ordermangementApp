const mongoose = require('mongoose');
     

const Schema = mongoose.Schema({
  type:  {
    type: String,
    unique: true,
    required: true
  },
  counter: Number 
});


mongoose.model('Counters', Schema);