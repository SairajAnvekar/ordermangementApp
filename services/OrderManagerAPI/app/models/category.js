const mongoose = require('mongoose');
const type = mongoose.Schema;

const Schema = mongoose.Schema({
    name: {
        type: String,      
        required: true
    },
    code: {
        type: String,
        unique: true,
        required: true
    },
});


mongoose.model('Category', Schema);