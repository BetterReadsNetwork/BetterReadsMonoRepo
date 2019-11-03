// TODO: Who is the responsible engineer for this file? Add name to each
// method / route so we know who to chase down for bugs

//import dependencies (from Auth0 tutorial)
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// user defined
const url = require("url");
const https = require("https");
const xml2js = require('xml2js');
// import BetterReads Libaries:
var Message = require("./schema/Message.js");
var Chat = require("./schema/Chat.js");
var Block = require("./schema/Block.js");
var Post = require('./models/post.js')
var Thread = require('./models/thread.js')
var Nofitication =require('./models/notification.js')
var Topic = require('./models/topic.js')
var User = require('./models/user.js')
var Book = require('./models/book.js')

// Authentication Libraries
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');

// define the Express app
const app = express();

// the database
const questions = [];

// enhance your app security with Helmet
app.use(helmet());

// use bodyParser to parse application/json content-type
// app.use(bodyParser.json());

// enable all CORS requests
app.use(cors());

// log HTTP requests
app.use(morgan('combined'));

// We defined this
app.set("view engine", "ejs");
const parser = new xml2js.Parser({attrkey: "ATTR"});
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);


/***************************************/
// app.get('/', (req, res)=>{
//   res.sendFile('index.html', {root: __dirname });
// });



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
    res.redirect('/discussions');
  });
});



app.post('/createPost', (req, res)=>{
  Thread.findById(req.body.thread_id, function(err, thread) {

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
  });
});
app.get('/createBook', (req, res)=>{
  new Book({title: req.query.title}).save( (a,b,c)=>{});
  res.redirect('/books');
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

app.get('/discussions/:id', (req, res)=>{
    Thread.findById(req.params.id, function(err, thread) {
      Post.find({'thread': [req.params.id]}).exec( (err,pp)=>
      res.render('thread', {
        thread: thread,
        posts: pp

      })
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







//*******************************************************.
//*** TODO REFACTOR CODE BELOW THEY ARE ADOPTED FROM
// https://auth0.com/blog/react-tutorial-building-and-securing-your-first-app/
// ASK ALEX ABOUT THE CODE DON'T MODIFY BELOW;

// retrieve all questions
app.get('/', (req, res) => {
  const qs = questions.map(q => ({
    id: q.id,
    title: q.title,
    description: q.description,
    answers: q.answers.length,
  }));
  res.send(qs);
});

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



// // insert a new question
// app.post('/', (req, res) => {
//   const {title, description} = req.body;
//   const newQuestion = {
//     id: questions.length + 1,
//     title,
//     description,
//     answers: [],
//   };
//   questions.push(newQuestion);
//   res.status(200).send();
// });
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

// // insert a new answer to a question
// app.post('/answer/:id', (req, res) => {
//   const {answer} = req.body;
//
//   const question = questions.filter(q => (q.id === parseInt(req.params.id)));
//   if (question.length > 1) return res.status(500).send();
//   if (question.length === 0) return res.status(404).send();
//
//   question[0].answers.push({
//     answer,
//   });
//
//   res.status(200).send();
// });
//
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



//// ********************************************
// STEFFEN's ROUTES FOR USERS;
// OWNER: STEFFEN:

app.get( '/getProfile', (req, res) =>{
  console.log(req.body);
  Profile.find({'user': req.body.query}).exec((err, profile)=>{
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



// start the server
app.listen(8081, () => {
  console.log('listening on port 8081');
});
