const express = require('express')
var https = require("https");
var Post = require('./models/post.js')
var Thread = require('./models/thread.js')
var Nofitication =require('./models/notification.js')
var Topic = require('./models/topic.js')
var User = require('./models/user.js')
var Book = require('./models/book.js')
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
app.get('/discussions', (req, res)=>{
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

app.listen(port, () =>console.log(`App listening on port ${port}`))
