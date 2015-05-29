// an ORM, allows us to write JS or noco using JS, without writing pure
// DB code, a translator, returns database in JS object format
var mongoose = require('mongoose');
// this connects our app to our local mongodb
// changed this to a remote db
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost:27017/potluck');
// export the module
module.exports = mongoose;
