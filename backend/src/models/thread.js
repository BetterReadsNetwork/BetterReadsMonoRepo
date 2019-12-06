// TODO: Who is the responsible engineer for this file?

var mongoose = require('mongoose');
var mongoDb = 'mongodb+srv://BetterReadsAdmin:yVFQUxYTrZFWt2Usiec4Wymw4asHz76xqthSXx5y@betterreads-teszn.gcp.mongodb.net/better_reads?retryWrites=true&w=majority';
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
  blocked_user_ids: [Number],
  posts: [{type: Schema.Types.ObjectId, ref: 'Post'}]
});
module.exports = mongoose.model('Thread', ThreadSchema);
