const mongoose = require('mongoose');
const api = {};


api.index = (Product, BudgetToken) => (req, res) => {
  const token = BudgetToken;
  if (token) {
    Product.find({}, (error, products) => {
      if (error) throw error;
      res.status(200).json(products);
    });
  } else return res.status(403).send({
    success: false,
    message: 'Unauthorized'
  });
}


api.add = (Product) => (req, res) => {
    if (!req.body.name || !req.body.category_id) res.json({
      success: false,
      message: 'Please, add name or categoy.'
    });
    else {
      Product.findOne({code: req.body.code}, (error, productOne) => {
        if (productOne) return res.status(400).json({
          success: false,
          message: "Code already exist"
        });
          const product = new Product({
            name: req.body.name,
            description: req.body.description,
            category_id: req.body.category_id,
            code: req.body.code,
            catCode: req.body.catCode,
            price: req.body.price,
            hasSize: req.body.hasSize ? req.body.hasSize : false,
            size: req.body.hasSize ? req.body.size : {}
          });
          product.save((error, product) => {
            if (error) return res.status(400).json({
              success: false,
              message: error
            });
            res.json({
              success: true,
              message: 'Poduct added successfully',
              data: product
            });
          });
        });
      }
    }

    api.edit = (Product) => (req, res) => {
      Product.findById(req.body._id, (error, product) => {
        if (error) return res.status(400).json(error);
        if (product) {

          product.name = req.body.name ? req.body.name : product.name,
            product.description = req.body.description ? req.body.description : product.description,
            product.category_id = req.body.category_id ? req.body.category_id : product.category_id,
            product.code = req.body.code ? req.body.code : product.code,
            product.price = req.body.price ? req.body.price : product.price,
            product.catCode = req.body.catCode ? req.body.catCode : product.catCode,
            product.hasSize = req.body.hasSize,
            product.size = req.body.hasSize ? req.body.size : product.size

          product.save((error, test) => {
            if (error) return res.status(400).json({
              success: false,
              message: 'Username or Empoyle ID already exists.'
            });
            res.json({
              success: true,
              message: test
            });
          });
        }
      });
    }

    api.deleteProduct = (Product) => (req, res) => {
      Product.remove({
        _id: req.body._id
      }, (error, order) => {
        if (error) res.status(400).json(error);
        res.status(200).json(order);
      })
    }

    module.exports = api;