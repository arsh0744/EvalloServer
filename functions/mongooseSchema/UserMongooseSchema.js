const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    Name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    userEmail: { type: String, required: true, unique: true },
    userPassword: { type: String, required: true },
  });
  
 
  const User = mongoose.model('User', userSchema);



  module.exports = User;
 