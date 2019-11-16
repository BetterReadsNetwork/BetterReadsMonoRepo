// TODO: Who is the responsible engineer for this file?

var mongoose = require("mongoose");

mongoose.connect('mongodb+srv://BetterReadsAdmin:yVFQUxYTrZFWt2Usiec4Wymw4asHz76xqthSXx5y@betterreads-teszn.gcp.mongodb.net/better_reads?retryWrites=true&w=majority');

var Schema = mongoose.Schema;

var message_schema = new Schema({
  from_uuid: {
    type: Number,
    required: true
  },
  to_uuid: {
    type: Number,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  ts: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model("Message", message_schema);
