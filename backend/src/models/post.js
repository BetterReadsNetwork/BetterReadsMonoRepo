// TODO: Who is the responsible engineer for this file?

var mongoose = require('mongoose');
var mongoDb = 'mongodb://127.0.0.1/myDb'
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
