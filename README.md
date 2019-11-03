# Integrated BetterReads Codebase
Updated November 3, 2019

`frontend`
- Alex and Steffen's work, i.e.: Auth workflow and Editing user profile in the frontend folder

`backend`
- Abeeku, Colson, Sam's work in backend folder


## Running Backend:
- `cd backend`
- `npm install`
- install mongodb community: refer to external documentation
- `node src`
- The app will run on `localhost:8081`
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
Running the backend would require the reverse;

- `cd frontend`
- `npm install`
- `npm start`
- Navigate to `localhost:3000`


## Notes:
- the `client` and `server` folders are from Steffen's first iteration; they
are iteratively being integrated into the `frontend` and `backend` folders respectively, and will be deleted eventually

# MESSAGING TO DO
- Prevent adding a chat when user is blocked.
