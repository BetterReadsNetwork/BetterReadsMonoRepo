// TODO: Who is the responsible engineer for this file?

var mongoose = require('mongoose');
var mongoDb = 'mongodb://127.0.0.1/myDb'
mongoose.connect(mongoDb, {useNewUrlParser: true} );
var db = mongoose.connection;
var Schema = mongoose.Schema;
var BookSchema = new Schema({
//  _id: Number,
  title: String,
  created_on: Date,
  topics: [{type: Schema.Types.ObjectId, ref: 'Topic'}]
});
module.exports = mongoose.model('Book', BookSchema);
