var db = require('./db');
// create a model, remember a model is a representation of our database
// this sets up our schema
module.exports = db.model( 'Dishes', {
    student: String,
    description: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
});
