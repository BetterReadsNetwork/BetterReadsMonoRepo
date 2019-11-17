// TODO: Who is the responsible engineer for this file?
// Abeeku
var mongoose = require('mongoose');
var mongoDb = 'mongodb+srv://BetterReadsAdmin:yVFQUxYTrZFWt2Usiec4Wymw4asHz76xqthSXx5y@betterreads-teszn.gcp.mongodb.net/better_reads?retryWrites=true&w=majority';
mongoose.connect(mongoDb, {useNewUrlParser: true} );
var db = mongoose.connection;
var Schema = mongoose.Schema;
var PostSchema = new Schema({
  //_id: Number,
  content: String,
  created_at: Date,
  thread: [{type: Schema.Types.ObjectId, ref: 'Thread'}]
});

module.exports = mongoose.model('Post', PostSchema);
