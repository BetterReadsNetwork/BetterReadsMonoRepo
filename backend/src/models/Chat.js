// TODO: Who is the responsible engineer for this file?

var mongoose = require("mongoose");

mongoose.connect('mongodb+srv://BetterReadsAdmin:yVFQUxYTrZFWt2Usiec4Wymw4asHz76xqthSXx5y@betterreads-teszn.gcp.mongodb.net/better_reads?retryWrites=true&w=majority');

var Schema = mongoose.Schema;

var chat_schema = new Schema({
  user: {
    type: Number,
    required: true
  },
  other: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model("Chat", chat_schema);
