const express = require('express')
var https = require("https");
//var mongoose = require('mongoose');
//var mongoDb = 'mongodb://127.0.0.1/myDb'
//mongoose.connect(mongoDb, {useNewUrlParser: true} );
//var db = mongoose.connection;
//var Schema = mongoose.Schema;
//mongoose population feature



var Post = require('./models/post.js')
var Thread = require('./models/thread.js')
var Nofitication =require('./models/notification.js')
const app = express()
const port = 4444
const xml2js = require('xml2js');
const parser = new xml2js.Parser({attrkey: "ATTR"});
var bodyParser  = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

app.post('/createThread', (req, res)=>{
  new Thread({
    title       : req.body.title,
    created_at  : Date.now() 
  }).save(function(err, thread, count){  
    res.redirect('/discussions');  
  });
});
app.post('/createPost', (req, res)=>{
  // Post content, Thread id
  
  Thread.findById(req.body.thread_id, function(err, thread) {  
  
  new Post({
    content   : req.body.content,
    created_at  : Date.now(),
    thread      : thread,
   }).save(function(err, post, count){  
    thread.posts.push(post)  
     var pp=[]
      thread.posts.forEach(function(v){pp.push(Post.findById(v))} )
     pp.forEach( (p)=>console.log(p.content) )
     console.log(req.body.content)
    thread.save(function(err, thread, count){ 
      res.redirect('/discussions/'+req.body.thread_id);  
    });
  });
  });
});

app.get('/posts', (req, res)=>{
/*  var posts = Post.find().sort({created_on: -1}) // Sort by created_on desc
  res.render('posts', {
    posts: posts
  });
*/
  Post.find(function(err, posts, count) {   
    res.render('posts', {
      posts: posts
    });
  });// .sort({created_on: -1}) // Sort by created_on desc
});

app.get('/discussions/:id', (req, res)=>{
    Thread.findById(req.params.id, function(err, thread) {
      var pp=[]
      thread.posts.forEach(function(v){pp.push(Post.findById(v))} )
      pp.push(Post.findOne(thread.posts[0]))
      Post.find({'thread': [req.params.id]}).exec( (err,pp)=>
      //console.log(pp)
      res.render('thread', {
        thread: thread,
        posts: pp 
     //   posts:  pp
      })
      )
     // res.render('thread', {
      //  thread: thread,
      //  posts: Post.find({'thread._id': req.params.id})
     //   posts:  pp
     // });
    });
});
app.get('/discussions', (req, res)=>{
/*  var posts = Post.find().sort({created_on: -1}) // Sort by created_on desc
  res.render('posts', {
    posts: posts
  });
*/
  Thread.find(function(err, threads, count) {   
    res.render('threads', {
      threads: threads
    });
  });// .sort({created_on: -1}) // Sort by created_on desc
});

app.get('/', (req, res)=>{
	res.sendFile('index.html', {root: __dirname });
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
      //Book.find
      //Thread.find({'book', ''})
      res.render('browse',{
        books: result['GoodreadsResponse']['search'],
      } )
      /*
    	result['GoodreadsResponse']['search'].forEach((book) =>{
		book.results[0]['work'].forEach((work)=>{
			 console.log(work.best_book[0].title[0])
			 res.write("<img src='"+ work.best_book[0].image_url[0]+"'/>");
			 res.write("<p>"+ work.best_book[0].title[0]+"</p>")
		});
	});
   */ });

    res.end()	  
  });

     res.end
  }).on("error", (err) => {
  console.log("Error: " + err.message);
  });
});

app.listen(port, () =>console.log(`App listening on port ${port}`))
