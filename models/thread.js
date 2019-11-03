var mongoose = require('mongoose');
var mongoDb = 'mongodb://127.0.0.1/myDb'
mongoose.connect(mongoDb, {useNewUrlParser: true} );
var db = mongoose.connection;
var Schema = mongoose.Schema;
var ThreadSchema = new Schema({
//  _id: Number,
  title: String,
  created_on: Date,
  active: Boolean,
  book: String,
  owner: {type: Schema.Types.ObjectId, ref: 'User'},
  users: [{type: Schema.Types.ObjectId, ref: 'User'}],
  viewStatus: String,
  posts: [{type: Schema.Types.ObjectId, ref: 'Post'}]
});
module.exports = mongoose.model('Thread', ThreadSchema);
