var mongoose = require('mongoose');
var mongoDb = 'mongodb://127.0.0.1/myDb'
mongoose.connect(mongoDb, {useNewUrlParser: true} );
var db = mongoose.connection;
var Schema = mongoose.Schema;
var UserSchema = new Schema({
//  _id: Number,
  name: String,
  created_on: Date,
  threads_following: [{type: Schema.Types.ObjectId, ref: 'Thread'}],
  notifications: [String]
});
module.exports = mongoose.model('User', UserSchema);
