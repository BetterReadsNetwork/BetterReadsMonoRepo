// TODO: Who is the responsible engineer for this file?

var mongoose = require('mongoose');
var mongoDb = 'mongodb+srv://BetterReadsAdmin:yVFQUxYTrZFWt2Usiec4Wymw4asHz76xqthSXx5y@betterreads-teszn.gcp.mongodb.net/better_reads?retryWrites=true&w=majority';
mongoose.connect(mongoDb, {useNewUrlParser: true} );
var db = mongoose.connection;
var Schema = mongoose.Schema;
var ProfileSchema = new Schema({
//  _id: Number,
  user: String,
  favoriteBook: String,
  favoriteGenre: String,
  ageRange: String,
  country: String,
  language: String,
  gender: String,
});
module.exports = mongoose.model('Profile', ProfileSchema);
