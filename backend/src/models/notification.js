// TODO: Who is the responsible engineer for this file?


var mongoose = require('mongoose');
var mongoDb = 'mongodb+srv://BetterReadsAdmin:yVFQUxYTrZFWt2Usiec4Wymw4asHz76xqthSXx5y@betterreads-teszn.gcp.mongodb.net/better_reads?retryWrites=true&w=majority';
mongoose.connect(mongoDb, {useNewUrlParser: true} );
var db = mongoose.connection;
var Schema = mongoose.Schema;

var NotifSchema = new Schema({
  content: String,
  thread: {type: Schema.Types.ObjectId, ref: 'Thread'},
  user: [{type: Schema.Types.ObjectId, ref: 'User'}]
});
module.exports = mongoose.model('Nofitication', NotifSchema)
