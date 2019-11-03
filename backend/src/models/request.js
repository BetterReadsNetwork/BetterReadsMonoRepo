// TODO: Who is the responsible engineer for this file?

var mongoose = require('mongoose');
var mongoDb = 'mongodb://127.0.0.1/myDb'
mongoose.connect(mongoDb, {useNewUrlParser: true} );
var db = mongoose.connection;
var Schema = mongoose.Schema;
var UserSchema = new Schema({
//  _id: Number,
  created_on: Date,
  accepter: {type: Schema.Types.ObjectId, ref: 'User'},
  thread: {type: Schema.Types.ObjectId, ref: 'Thread'},
  stat: Number, // 0 for not yet 1 for acc -1 for no
  requester: {type: Schema.Types.ObjectId, ref: 'User'},
});
module.exports = mongoose.model('User', UserSchema);
