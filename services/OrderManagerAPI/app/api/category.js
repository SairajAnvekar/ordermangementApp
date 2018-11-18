const mongoose = require('mongoose');
const api = {};


api.index = (Category, BudgetToken) => (req, res) => {
    const token = BudgetToken;
    if (token) {
        Category.find({}, (error, category) => {
            if (error) throw error;
            res.status(200).json(category);
        });
    } else return res.status(403).send({ success: false, message: 'Unauthorized' });
}


api.add = (Category) => (req, res) => {
  if (!req.body.name || !req.body.code) res.json({ success: false, message: 'Please, add name or categoy.' });
  else {
    const category = new Category({
      name: req.body.name,
      code: req.body.code,      
    });
    category.save(error => {
      if (error) return res.status(400).json({ success: false, message:error });
      res.json({ success: true, message: 'Category added successfully' });
    });
  }
}

api.deleteCat = (Category, Product) => (req, res) => {
  Product.find({
    catCode: req.body.code
  }, (error, products) => { 
    console.log(products)  
    if (products.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'The category code is already in use, please delete the product with this Category'
      });
    } else {
      Category.remove({
        _id: req.body._id
      }, (error, category) => {
        if (error) res.status(400).json(error);
        res.status(200).json({
          success: true,
          message: 'The category code is already in use, please delete the product with this Category'
        });
      })
    }
  });
}

/*
api.edit = (Product) => (req, res) => {
    Product.findById(req.body._id,(error, product) =>  { 
     if (error) return res.status(400).json(error);
     if (product) {
      user.password = req.body.password ? req.body.password : user.password;
      product.name= req.body.name ?req.body.name:product.name,
      product.description=req.body.description?req.body.description:product.description ,
      product.category_id=req.body.category_id?req.body.category_id:product.category_id ,
      product.code=req.body.code ?req.body.code:product.code,
      product.price=req.body.price?req.body.price:product.price,
     
      product.save((error,test) => {
        if (error) return res.status(400).json({ success: false, message: 'Username or Empoyle ID already exists.' });
        res.json({ success: true, message: test });
      });
     }
    });
  }
*/

module.exports = api;
