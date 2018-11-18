const mongoose = require('mongoose');
const type = mongoose.Schema;
var DateOnly = require('mongoose-dateonly')(mongoose);

const payments = mongoose.Schema({
    payment_date: {
        type: Date,
        timestamps: true,
        default: Date.now
    },
    amount_paid: Number,
    type: String,
    mode: String,
});
const Schema = mongoose.Schema({
    customer_name: {
        type: String,
        required: true
    },
    customer_tel: {
        type: String,
        required: true
    },
    created_user: {
        type: String,
        required: true
    },
    total: Number,
    tax: Number,
    taxAmt: Number,
    grand_total: Number,
    order_no: Number,
    status: String,
    order_date: {
        type: DateOnly,
        timestamps: true,
        default: Date.now
    },
    order_time: {
        type: Date,
        timestamps: true,
        default: Date.now
    },
    delivery_date: DateOnly,
    orderDetails: [{
        amt: Number,
        productName:String,
        hasSize: Boolean,
        index: Number,
        price: Number,
        productId: String,     
        qty: Number,
        rate: Number,
        size: {},
        height:Number,
        width: Number,
    }],
    paymentDetails: [{
        payment_date: {
            type: Date,
            timestamps: true,
            default: Date.now
        },
        mode: String,
        amount: Number
    }],
    notes: {
        type: String
    },
    payment: Number,
    paid_amount: Number,
    payemt_status: String
});


mongoose.model('Order', Schema);