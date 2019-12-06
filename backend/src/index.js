/******************************************************************************

BetterReads
(betterreads.org)

Backend, Main `index.js` file
Fall 2019
CIS 350
University of Pennsylvania
PM: Irene Zhang
Professor Chris Murphy

Abeeku Bondzie, Daniel Colson, Steffen Cornwell, Sam Oshay, Alex Zhao
[ dcolson, alexzhao, abeeku ] @ seas.upenn.edu
[ oshay, steffenc ] @ wharton.upenn.edu

TODO: Add name to each method / route so we know who to chase down for bugs
********************************************************************************/




/* External Libraries *********************************************************

- `body-parser:`` This is a library that you will use to convert the body of incoming
requests into JSON objects / urlencoded objects.
- `cors`: This is a library that you will use to configure Express to add headers
stating that your API accepts requests coming from other origins. This is also
known as Cross-Origin Resource Sharing (CORS).
- `helmnet`: This is a library that helps to secure Express apps with various HTTP headers.
- `morgan`: This is a library that adds some logging capabilities to your Express app.`
- `url`: The URL module splits up a web address into readable parts
- `https`: HTTPS is the HTTP protocol over TLS/SSL. In Node.js this is implemented
as a separate module.
- `xml2js`: Simple XML to JavaScript object converter. It supports bi-directional
conversion. Uses sax-js and xmlbuilder-js.
*/
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const url = require("url");
const https = require("https");
const xml2js = require('xml2js');
var session = require('express-session')
var MongoStore = require('connect-mongo')(session);

var mongoose = require('mongoose');
var mongoDb = 'mongodb+srv://BetterReadsAdmin:yVFQUxYTrZFWt2Usiec4Wymw4asHz76xqthSXx5y@betterreads-teszn.gcp.mongodb.net/better_reads?retryWrites=true&w=majority';
mongoose.connect(mongoDb, {useNewUrlParser: true} );
var db = mongoose.connection;

/* Authentication Libraries ****
var MongoStore = require('connect-mongo')(session);
 * 
- `express-jwt`:  A middleware that validates a JSON Web Token (JWT) and set the
req.user with its attributes.
- `jwks-rsa`: A library to retrieve RSA public keys from a JWKS (JSON Web Key Set) endpoint.
*/
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');

/* BetterReads Libraries ******************************************************
*/
var Message = require("./models/Message.js");
var Chat = require("./models/Chat.js");
var Block = require("./models/Block.js");
var Post = require('./models/post.js')
var Thread = require('./models/thread.js')
var Nofitication =require('./models/notification.js')
var Topic = require('./models/topic.js')
var User = require('./models/user.js')
var Book = require('./models/book.js')
var Profile = require('./models/profile.js')

/******************************************************************************/

// define the Express app
const app = express();

// the database
const questions = [];

// enhance your app security with Helmet
app.use(helmet());

// use bodyParser to parse different content types, such as
// application/json content-type
// Awesome article on bodyParser: https://medium.com/@adamzerner/how-bodyparser-works-247897a93b90
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// add more ues of bodyParser here
const parser = new xml2js.Parser({attrkey: "ATTR"});

// enable all CORS requests
app.use(cors());

// log HTTP requests
app.use(morgan('combined'));

// Set backend view engine to EJS
app.set("view engine", "ejs");


app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

/******************************************************************************/
 //app.get('/', (req, res)=>{
 //  res.sendFile('index.html', {root: __dirname });
 //});

app.get('/', function (req, res, next) {
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
                   
          return res.render("index", {user: user})
        } else {

          return res.render("index", {user: user})
         // return res.send('<h1>Name: </h1>' + user.username + '<h2>Mail: </h2>' + user.email + '<br><a type="button" href="/logout">Logout</a>')
        }
      }
    });
});

app.get('/listUsers', (q, s) => {
  User.find({}, (e, u) => {
    s.send( JSON.stringify( u ) );
  });
})


app.use("/api/block_user/:id", (req, res) => {
  var user = req.params.id;
  var other = req.body.other;
  if (user === other) {
    res.redirect("/chats/" + user);
    return;
  }
  var q = {
    user: user,
    other: other
  };

  Block.find(q, (err, chats) => {
    if (err) {
      res.type("html").status(200);
      console.log("Messaging error" + err);
      res.write(err);
    } else if (chats.length > 0) {
      res.redirect("/messages/" + user);
    } else {
      new_block = new Block(q);
      new_block.save(err => {
        if (err) {
          res.type("html").status(200);
          res.write("Block error: " + err);
          console.log(err);
          res.end();
        } else {
          res.redirect("/chats/" + user);
        }
      });
    }
  });
});

app.use("/api/unblock_user/:id/:other", (req, res) => {
  var user = req.params.id;
  var other = req.params.other;
  if (user === other) {
    res.redirect("/chats/" + user);
    return;
  }
  var q = {
    user: user,
    other: other
  };

  Block.find(q, (err, chats) => {
    if (err) {
      res.type("html").status(200);
      console.log("Messaging error" + err);
      res.write(err);
    } else if (chats.length > 0) {
      Block.remove(q, (err, blocked) => {
        if (err) {
          console.log("unblocking error");
        }
      });
    }
    res.redirect("/messages/" + user);
  });
});

/***************************************/
app.use("/api/add_chat/:id", (req, res) => {
  var user = req.params.id;
  var other = req.body.other;
  if (user === other) {
    res.redirect("/chats/" + user);
    return;
  }
  var q = {
    user: user,
    other: other
  };

  Block.find(q, (err, blocks) => {
    if (err) {
      res.type("html").status(200);
      console.log("Messaging error" + err);
      res.write(err);
    } else if (blocks.length > 0) {
      res.redirect("/chats/" + user);
    } else {
      Chat.find(q, (err, chats) => {
        if (err) {
          res.type("html").status(200);
          console.log("Messaging error" + err);
          res.write(err);
        } else if (chats.length > 0) {
          var dest = "/messages/" + user + "/" + other;
          res.redirect(dest);
        } else {
          new_chat = new Chat(q);
          new_chat.save(err => {
            if (err) {
              res.type("html").status(200);
              res.write("Messaging error: " + err);
              console.log(err);
              res.end();
            } else {
              var dest = "/messages/" + user + "/" + other;
              res.redirect(dest);
            }
          });
        }
      });
    }
  });
});

/***************************************/

app.use("/api/send_message/:user/:other", (req, res) => {
  var user = req.params.user;
  var other = req.params.other;
  if (user === other) {
    res.redirect("/chats/" + user);
    return;
  }
  var new_message = new Message({
    to_uuid: other,
    from_uuid: user,
    message: req.body.msg,
    ts: Math.floor(Date.now() / 1000)
  });

  new_message.save(err => {
    if (err) {
      res.type("html").status(200);
      res.write("Messaging error: " + err);
      console.log(err);
      res.end();
    } else {
      /*       var msg = req.body.msg;
      if (msg.indexOf("https://appr.tc/r/") != -1) {
        res.redirect(
          msg.substring(
            msg.indexOf("https://appr.tc/r/"),
            msg.indexOf("https://appr.tc/r/") + 27
          )
        );
      }
      console.log(msg); */
      var dest = "/messages/" + user + "/" + other;
      res.redirect(dest);
    }
  });
});

app.use("/api/get_messages/:user/:other", (req, res) => {
  var user = req.params.user;
  var other = req.params.other;
  if (user === other) {
    res.redirect("/chats/" + user);
    return;
  }

  var query = {
    $or: [
      {
        from_uuid: user,
        to_uuid: other
      },
      {
        from_uuid: other,
        to_uuid: user
      }
    ]
  };

  Message.find(query, (err, msgs) => {
    if (err) {
      res.type("html").status(200);
      console.log("Messaging error" + err);
      res.write(err);
    } else {
      if (msgs.length == 0) {
        res.json({
          msgs: {}
        });
        return;
      }
      var json_res = [];

      msgs.forEach(msg => {
        if (msg.to_uuid != user) {
          var to_me = false;
        } else {
          var to_me = true;
        }

        json_res.push({
          to_me: to_me,
          text: msg.message
        });
      });
      res.json({
        msgs: json_res
      });
    }
  });
});

/***************************************/

app.use("/messages/:user/:other", (req, res) => {
  var user = req.params.user;
  var other = req.params.other;

  var query = {
    $or: [
      {
        from_uuid: user,
        to_uuid: other
      },
      {
        from_uuid: other,
        to_uuid: user
      }
    ]
  };

  Message.find(query, (err, msgs) => {
    if (err) {
      res.type("html").status(200);
      console.log("Messaging error" + err);
      res.write(err);
    } else {
      if (msgs.length == 0) {
        res.render("messages", {
          msgs: [],
          user: user,
          other: other
        });
        return;
      }
      res.render("messages", {
        msgs: msgs,
        user: user,
        other: other
      });
    }
  });
});

app.use("/chats/:id", (req, res) => {
  var uuid = req.params.id;
  var query = {
    $or: [
      {
        user: uuid
      },
      {
        other: uuid
      }
    ]
  };
  Chat.find(query, (err, chats) => {
    if (err) {
      res.type("html").status(200);
      console.log("Messaging error" + err);
      res.write(err);
      return;
    }

    if (chats.length == 0) {
      chats = [];
    }

    var chat_ids = [];
    chats.forEach(chat => {
      if (chat.user == uuid) {
        var block_q = {
          user: uuid,
          other: chat.other
        };

        Block.find(block_q, (err, blocks) => {
          if (err) {
            res.type("html").status(200);
            console.log("Messaging error" + err);
            res.write(err);
            return;
          } else if (blocks.length == 0) {
            chat_ids.push({ other: chat.other });
          }
        });
      } else {
        var block_q = {
          user: chat.other,
          other: uuid
        };

        Block.find(block_q, (err, blocks) => {
          if (err) {
            res.type("html").status(200);
            console.log("Messaging error" + err);
            res.write(err);
            return;
          } else if (blocks.length == 0) {
            chat_ids.push({ other: chat.user });
          }
        });
      }
    });
    Block.find({ user: uuid }, (err, blocks) => {
      if (err) {
        res.type("html").status(200);
        console.log("Messaging error" + err);
        res.write(err);
        return;
      } else if (blocks.length == 0) {
        blocks = [];
      }
      res.render("chats", {
        chats: chat_ids,
        uuid: uuid,
        blocked: blocks
      });
    });
  });
});

/*************************************************/
app.post('/createThread', (req, res)=>{
  console.log(res)
  new Thread({
    title       : req.body.title,
    book : req.body.book,
    viewStatus: 'private',
    created_at  : Date.now()
  }).save(function(err, thread, count){
    console.log(thread)
    res.redirect('/discussions');
  });
});

app.get('/createThread', (req, res)=>{
  new Thread({
    title       : req.query.title,
    created_at  : Date.now()
  }).save(function(err, thread, count){
		console.log("Thread saved")
    res.redirect('/discussions');
  });
});


app.get('/createSession', (req, res)=>{
	User.find
  new Session({
    title       : req.query.title,
    created_at  : Date.now()
  }).save(function(err, thread, count){
    res.redirect('/discussions');
  });
});

app.post('/createPost', (req, res)=>{
  Thread.findById(req.body.thread_id, function(err, thread) {
  if(!thread.blocked_user_ids.includes(req.session.userId))
  new Post({
    content   : req.body.content,
    created_at  : Date.now(),
    thread      : thread,
   }).save(function(err, post, count){
    thread.posts.push(post)
     //var pp=[]
     // thread.posts.forEach(function(v){pp.push(Post.findById(v))} )
   //  pp.forEach( (p)=>console.log(p.content) )

     thread.users.forEach((user)=>{
      user.notifications.push("New post added to '"+ thread.title+"'")
      user.save
     });
     console.log(req.body.content)
    thread.save(function(err, thread, count){
      res.redirect('/discussions/'+req.body.thread_id);
    });
  });
  }  else{
    
    }
  });
});
app.get('/createBook', (req, res)=>{
  new Book({title: req.query.title}).save( (a,b,c)=>{});
  res.redirect('/books');
});

app.post('/createUser', (req, res)=>{
	console.log("Test create user")
  new User({name: req.body.username,password: req.body.password, notifications: ['Update yer Profile']}).save( (a,b,c)=>{console.log(b)});

  res.redirect('/');
});
app.get('/createUser', (req, res)=>{
  new User({name: 'Roonil Wazlib', notifications: ['Update yer Profile']}).save( (a,b,c)=>{console.log(b)});

  res.redirect('/');
});
app.get('/books', (req, res)=>{
  Book.find(function(err, books, count) {
    res.render('books', {
      books: books
    });
  });// .sort({created_on: -1}) // Sort by created_on desc
});
app.get('/posts', (req, res)=>{
  Post.find(function(err, posts, count) {
    res.render('posts', {
      posts: posts
    });
  });// .sort({created_on: -1}) // Sort by created_on desc
});
//API

app.get('/api/books', (req, res)=>{
  Book.find(function(err, books, count) {
		res.json(books)
  });// .sort({created_on: -1}) // Sort by created_on desc
});

app.get('/api/users', (req, res)=>{
  User.find(function(err, users, count) {
		res.json(users)
  });// .sort({created_on: -1}) // Sort by created_on desc
});
app.get('/api/posts', (req, res)=>{
  Post.find(function(err, posts, count) {
		res.json(posts)
  });// .sort({created_on: -1}) // Sort by created_on desc
});
app.get('/api/discussions', (req, res)=>{
  Thread.find(function(err, threads, count) {
      res.json(threads)
  });// .sort({created_on: -1}) // Sort by created_on desc
});

app.get('/api/discussions/:id', (req, res)=>{
    Thread.findById(req.params.id, function(err, thread) {
      Post.find({'thread': [req.params.id]}).exec( (err,pp)=>
				res.json({
					thread,
					posts: pp
				})
      )

    });
});

app.get('/report/:thread_id/:user_id', (req, res)=>{
    //TODO check if user is an admin
      Thread.findById(req.params.thread_id, function(err, thread) {
         thread.blocked_user_ids.push(req.params.user_id);
         thread.save();
         res.redirect('/');
      });
    });
});
app.get('/api/browse/:query', (req, res)=>{
 // res.type('html').status(200);
  var quer = req.params.query.split(' ').join('+')
https.get("https://www.goodreads.com/search.xml?key=t2cVFqoGd4F2Ppfdc2ONVQ&q="+quer, (resp) => {
  let data = '';

  resp.on('data', (chunk) => {
     data += chunk;
  });

  resp.on('end', () => {
    parser.parseString(data, (error, result)=>{
     	res.json(result['GoodreadsResponse']['search'])
			// res.render('browse',{
     //   books: result['GoodreadsResponse']['search'],
   //   } )
   });

    res.end()
  });

     res.end
  }).on("error", (err) => {
  console.log("Error: " + err.message);
  });
});

//API


app.get('/discussions/:id', (req, res)=>{
    Thread.findById(req.params.id, function(err, thread) {
      Post.find({'thread': [req.params.id]}).exec( (err,pp)=>
      {   
        User.findById(req.session.userId).exec((e, u)=>{
             
        res.render('thread', {
        thread: thread,
        posts: pp,
        user: u
        })
        
      }  );
      
    }
      )

    });
});
app.get('/users/:id', (req, res)=>{
    User.findById(req.params.id, function(err, user) {
     if(user == null){
      res.redirect("/");
     }
      res.render('user', {
        user: user

      })

    });
});
app.get('/login', (req, res)=>{
	res.render('login');
});

app.post('/login', function (req, res, next) {
  // confirm that user typed same password twice
  if (req.body.password !== req.body.passwordConf) {
    var err = new Error('Passwords do not match.');
    err.status = 400;
    res.send("passwords dont match");
    return next(err);
  }

  if (req.body.email &&
    req.body.username &&
    req.body.password &&
    req.body.passwordConf) {

    var userData = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
    }

    User.create(userData, function (error, user) {
      if (error) {
        return next(error);
      } else {
        req.session.userId = user._id;
        return res.redirect('/profile');
      }
    });

  } else if (req.body.logemail && req.body.logpassword) {
    User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
      if (error || !user) {
        var err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = user._id;
        return res.redirect('/profile');
      }
    });
  } else {
    var err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }
})

// GET route after registering
app.get('/profile', function (req, res, next) {
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          var err = new Error('Not authorized! Go back!');
          err.status = 400;
          return next(err);
        } else {
          return res.send('<h1>Name: </h1>' + user.username + '<h2>Mail: </h2>' + user.email + '<br><a type="button" href="/logout">Logout</a>')
        }
      }
    });
});

// GET for logout logout
app.get('/logout', function (req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});
app.get('/register', (req, res)=>{
	res.render('register');
});
app.get('/discussions', (req, res)=>{

  Thread.find(function(err, threads, count) {
    res.render('threads', {
      threads: threads
    });
  });// .sort({created_on: -1}) // Sort by created_on desc
});


app.post('/browse', (req, res)=>{
  res.type('html').status(200);
  var quer = req.body.query.split(' ').join('+')
https.get("https://www.goodreads.com/search.xml?key=t2cVFqoGd4F2Ppfdc2ONVQ&q="+quer, (resp) => {
  let data = '';

  resp.on('data', (chunk) => {
     data += chunk;
  });

  resp.on('end', () => {
    parser.parseString(data, (error, result)=>{
      res.render('browse',{
        books: result['GoodreadsResponse']['search'],
      } )
   });

    res.end()
  });

     res.end
  }).on("error", (err) => {
  console.log("Error: " + err.message);
  });
});
app.post( '/browseDiscussions',(req, res) =>{
  Thread.find({'user': req.body.query}).exec((err, threads)=>{
    res.render('browseD', {
      threads: threads
    });
  });
})







/* ROUTES FOR AUTHENTICATION **************************************************/
// Adapted from https://auth0.com/blog/react-tutorial-building-and-securing-your-first-app/
// Manage Auth0 secrets via Auth0.com dashboard; login in shared 1Password
// Responsible Engineer: Alex Zhao


// retrieve all questions
/*
app.get('/', (req, res) => {
  const qs = questions.map(q => ({
    id: q.id,
    title: q.title,
    description: q.description,
    answers: q.answers.length,
  }));
  res.send(qs);
});
*/
// get a specific question
app.get('/:id', (req, res) => {
  const question = questions.filter(q => (q.id === parseInt(req.params.id)));
  if (question.length > 1) return res.status(500).send();
  if (question.length === 0) return res.status(404).send();
  res.send(question[0]);
});

// Authentication Endpoints:
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://betterreads.auth0.com/.well-known/jwks.json`
  }),

  // Validate the audience and the issuer.
  audience: 'DY9GivEwhB4t1veDXKaElra0lfRR2fLi',
  issuer: `https://betterreads.auth0.com`,
  algorithms: ['RS256']
});

// insert a new question
app.post('/', checkJwt, (req, res) => {
  const {title, description} = req.body;
  const newQuestion = {
    id: questions.length + 1,
    title,
    description,
    answers: [],
    author: req.user.name,
  };
  questions.push(newQuestion);
  res.status(200).send();
});

// insert a new answer to a question
app.post('/answer/:id', checkJwt, (req, res) => {
  const {answer} = req.body;

  const question = questions.filter(q => (q.id === parseInt(req.params.id)));
  if (question.length > 1) return res.status(500).send();
  if (question.length === 0) return res.status(404).send();

  question[0].answers.push({
    answer,
    author: req.user.name,
  });

  res.status(200).send();
});









/* ROUTS FOR EDITING USER PROFILE ********************************************/
// Responsible Engineer: Steffen Cornwell {steffenc@wharton.upenn.edu}

app.get( '/getProfile', (req, res) =>{
  console.log("GET Profile")
  console.log(req.body);
  Profile.find({'user': req.body.query}).exec((err, profile) => {
    res.send(profile);
  });
})

app.post( '/setProfile', (req, res) =>{
  console.log(req.body);
  new Profile({
    username: req.body.username,
    favoriteBook: req.body.favoriteBook,
    favoriteGenre: req.body.favoriteGenre,
    ageRange: req.body.ageRange,
    country: req.body.country,
    language: req.body.language,
    gender: req.body.language
    }).save(function(err, Profile, count) {
      res.send(" Profile")
     console.log(err);
    });
  });


/* ROUNTES END ****************************************************************/


// start the server
app.listen(process.env.PORT || 4444, () => {
  console.log('listening on port 4444');
});
