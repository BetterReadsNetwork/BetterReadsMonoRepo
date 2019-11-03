// TODO: Who is the responsible engineer for this file?

var mongoose = require('mongoose');
var mongoDb = 'mongodb://127.0.0.1/myDb'
mongoose.connect(mongoDb, {useNewUrlParser: true} );
var db = mongoose.connection;
var Schema = mongoose.Schema;
var TopicSchema = new Schema({
//  _id: Number,
  title: String,
  created_on: Date,
  books: [{type: Schema.Types.ObjectId, ref: 'Book'}]
});
module.exports = mongoose.model('Topic', TopicSchema);
