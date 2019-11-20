# Integrated BetterReads Codebase
Updated November 3, 2019

`frontend`
- Alex and Steffen's work, i.e.: Auth workflow and Editing user profile in the frontend folder

`backend`
- Abeeku, Colson, Sam's work in backend folder


## Running Backend:
- open `/backend/src/index.js` and comment out: 
```
app.get('/', (req, res) => {
  const qs = questions.map(q => ({
    id: q.id,
    title: q.title,
    description: q.description,
    answers: q.answers.length,
  }));
  res.send(qs);
});
```
- in the same file, uncomment:
```
app.get('/', (req, res)=>{
    res.sendFile('index.html', {root: __dirname });
});
```
- `cd backend`
- `npm install`
- install mongodb community: refer to external documentation
- `mongod --config /usr/local/etc/mongod.conf`, leave this terminal window open 
- open another terminal window, and in that window type
- `node src`
- The app will run on `localhost:4444`
- (Extra) `node app.js`: What is this `app.js` for? Does it perform any other functionality not found in `index.js`? @Abeeku (@Alex wonders //TODO)

## Running frontend:
NOTE: Current implemementation of the backend server uses port 8081 for both
the backend messaging and video calling funtionality as well as (a separate backend)
for the auth workflow. Running the frontend requires uncommenting (in `/backend/src/index.js`)

```
app.get('/', (req, res) => {
  const qs = questions.map(q => ({
    id: q.id,
    title: q.title,
    description: q.description,
    answers: q.answers.length,
  }));
  res.send(qs);
});
```
and commenting out:
```
app.get('/', (req, res)=>{
    res.sendFile('index.html', {root: __dirname });
});
```

- `cd frontend`
- `npm install`
- `npm start`
- Navigate to `localhost:3000`


## Notes:
- the `client` and `server` folders are from Steffen's first iteration; they
are iteratively being integrated into the `frontend` and `backend` folders respectively, and will be deleted eventually UPDATE: they have been merged with `frontend` and `backend`!!
# Running app on Expo
Install expo-cli first
```
- `cd frontend`
- `cd betterReadsApp`
-  `expo start`
Scan the qr code or run it in the android emulator
```

# MESSAGING TO DO
- Prevent adding a chat when user is blocked.
