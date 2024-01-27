const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
    UserId : { type: String, required: true },
    Title: { type: String, required: true },
    Description: { type: String, required: true, },
    Link: { type: String, required: true },
    Info: { type: String }

    
  });
  
 
  const Content = mongoose.model('Content', contentSchema);

  module.exports = Content;
