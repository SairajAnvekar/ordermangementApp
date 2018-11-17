const mongoose = require('mongoose');
const api = {};
api.setup = (User) => (req, res) => {
  const admin = new User({
    username: 'admin1',
    password: 'admin123456',
    role:"admin",
    clients: []
  });
admin.save(error => {
    if (error) throw error;
console.log('Admin account was succesfully set up');
    res.json({ success: true });
  })
}

api.index = (User, BudgetToken) => (req, res) => {
  const token = BudgetToken;
if (token) {
    User.find({}, (error, users) => {
      if (error) throw error;
      res.status(200).json(users);
    });
  } else return res.status(403).send({ success: false, message: 'Unauthorized' });
}

api.signup = (User) => (req, res) => {
  if (!req.body.username || !req.body.password) res.json({ success: false, message: 'Please, pass an username and password.' });
  else {
    const user = new User({
      username: req.body.username,
      name: req.body.name,
      password: req.body.password,
      emp_id: req.body.emp_id,
      role: req.body.role,
      tel_no: req.body.tel_no,
      email: req.body.email, 
    });

    user.save(error => {
      if (error) return res.status(400).json({ success: false, message:error });
      res.json({ success: true, message: 'Account created successfully' });
    });
  }
}

api.edit = (user) => (req, res) => {
  user.findById(req.body._id,(error, user) =>  { 
     if (error) return res.status(400).json(error);
     if (user) {
      user.password = req.body.password ? req.body.password : user.password;
      user.username = req.body.username ? req.body.username : user.username;    
      user.role = req.body.role ? req.body.role : user.role;
      user.email = req.body.email ? req.body.email : user.email;
      user.tel_no = req.body.tel_no ? req.body.tel_no : user.tel_no;    
      user.name = req.body.name ? req.body.name : user.name;
     
      user.save((error,user) => {
        if (error) return res.status(400).json({ success: false, message: 'Username or Empoyle ID already exists.' });
        res.json({ success: true, message: user });
      });
     }
    });
  }

  api.delete = (user) => (req, res) => {
    user.remove({_id: req.body._id }, (error, users) => {
      if (error) throw error;
      res.status(200).json(users);
    });
  }
  

module.exports = api;
