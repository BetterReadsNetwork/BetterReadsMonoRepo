// TODO: Who is the responsible engineer for this file?

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var mongoDb = 'mongodb+srv://BetterReadsAdmin:yVFQUxYTrZFWt2Usiec4Wymw4asHz76xqthSXx5y@betterreads-teszn.gcp.mongodb.net/better_reads?retryWrites=true&w=majority';
mongoose.connect(mongoDb, {useNewUrlParser: true} );
var db = mongoose.connection;

var Schema = mongoose.Schema;


var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
//    required: true,
    trim: true
  },
  username: {
    type: String,
    unique: true,
  //  required: true,
    trim: true
  },
  password: {
    type: String,
   // required: true,
  },
  facebook: {
    id: String,
    token: String,
    email: String,
    name: String
  },
  notifications: [String]
});

/*
	var UserSchema = new Schema({
//  _id: Number,  name: String,
  password: String,
  created_on: Date,
  logged_in: { Boolean,default: false },
  threads_following: [{type: Schema.Types.ObjectId, ref: 'Thread'}],
  privateThreads: [{type: Schema.Types.ObjectId, ref: 'Thread'}],
  notifications: [String]
});
*/
UserSchema.statics.authenticate = function (email, password, callback) {
  User.findOne({ email: email })
    .exec(function (err, user) {
      if (err) {
        return callback(err)
      } else if (!user) {
        var err = new Error('User not found.');
        err.status = 401;
        return callback(err);
      }
      bcrypt.compare(password, user.password, function (err, result) {
        if (result === true) {
          return callback(null, user);
        } else {
          return callback();
        }
      })
    });
}

module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
}
//hashing a password before saving it to the database
UserSchema.pre('save', function (next) {
  
  var user = this;
  if(user.facebook.id){
    console.log('special')
    if(user.email == null){
      user.email = "facebook@facebook.com";
    }
    if(user.username == null){
      user.username = user.facebook.id;
    }
    next();
   }
  else{

  bcrypt.hash(user.password, 10, function (err, hash) {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  })
  }
});

var User = mongoose.model('User', UserSchema);
module.exports = User;
