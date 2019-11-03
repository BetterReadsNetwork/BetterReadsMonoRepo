var mongoose = require('mongoose');
var mongoDb = 'mongodb://127.0.0.1/myDb'
mongoose.connect(mongoDb, {useNewUrlParser: true} );
var db = mongoose.connection;
var Schema = mongoose.Schema;

var NotifSchema = new Schema({
  content: String,
  thread: {type: Schema.Types.ObjectId, ref: 'Thread'},
  user: [{type: Schema.Types.ObjectId, ref: 'User'}]
});
module.exports = mongoose.model('Nofitication', NotifSchema)
