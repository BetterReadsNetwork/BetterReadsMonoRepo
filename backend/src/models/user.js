// TODO: Who is the responsible engineer for this file?

var mongoose = require('mongoose');
var mongoDb = 'mongodb+srv://BetterReadsAdmin:yVFQUxYTrZFWt2Usiec4Wymw4asHz76xqthSXx5y@betterreads-teszn.gcp.mongodb.net/better_reads?retryWrites=true&w=majority';
mongoose.connect(mongoDb, {useNewUrlParser: true} );
var db = mongoose.connection;
var Schema = mongoose.Schema;
var UserSchema = new Schema({
//  _id: Number,
  name: String,
  password: String,
  created_on: Date,
  logged_in: { Boolean,default: false },
  threads_following: [{type: Schema.Types.ObjectId, ref: 'Thread'}],
  privateThreads: [{type: Schema.Types.ObjectId, ref: 'Thread'}],
  notifications: [String]
});
module.exports = mongoose.model('User', UserSchema);
