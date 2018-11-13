const mongoose = require('mongoose');
const api = {};


api.index = (Order, BudgetToken) => (req, res) => {
    const token = BudgetToken;
    if (token) {
        Order.find({}).sort( { order_no: -1 } ).exec((error, orders) => {
            if (error) throw error;
            res.status(200).json(orders);
        });
    } else return res.status(403).send({ success: false, message: 'Unauthorized' });
}

api.add = (Order,Counter) => (req, res) => {

   Counter.findOneAndUpdate( {type: "orderNo" },{ $inc: { counter: 1 } }, {new: true }, function(err, result){
	   console.log('result');
	     console.log(result);
		   console.log(err);
        if (!req.body.order) res.json({ success: false, message: 'Please, add name or categoy.' });
  else {
    console.log(req.body.order)
	req.body.order.order_no = result.counter;
    const order = new Order(req.body.order);
    order.save((error, data) => {
      if (error) return res.status(400).json({ success: false, message:error });
      res.json({ success: true, message: 'Order added successfully',data:data });
    });
  }
		
		
    } );
}	
 


api.setupCounter=(Counter) => (req, res) => {  
  const counter = new Counter({type: "orderNo",counter:0});
  counter.save(error => {
    if (error) return res.status(400).json({ success: false, message:error });
    res.json({ success: true, message: 'Counter added successfully' });
  });
}

api.edit = (Order) => (req, res) => {
 Order.findOneAndUpdate({ _id: req.body.order._id }, req.body.order, (error, order) => {
          if (error) res.status(400).json(error);        
			Order.findOne({ _id: req.body.order._id },(error, orders) => {
				if (error) throw error;
				res.status(200).json(orders);
			});
    })   
  }


module.exports = api;
