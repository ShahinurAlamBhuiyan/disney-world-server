const express = require('express');
const app = express()
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const ObjectID = require('mongodb').ObjectID;


const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7wr7p.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const moviesCollection = client.db("disneyData").collection("allMovies");
  console.log("hello db connection")

  app.post('/addDisney',(req, res)=>{
    const backgroundImg = req.body.backgroundImg;
    const cardImg = req.body.cardImg;
    const description = req.body.description;
    const subTitle = req.body.subTitle;
    const title = req.body.title;
    const titleImg = req.body.titleImg;
    const type = req.body.type;
    moviesCollection.insertOne({backgroundImg,cardImg,description,subTitle,title,titleImg,type})
    .then(result=>{
        res.send(result.insertedCount > 0);
        console.log(result)
      })
  });

  app.get('/allMovies', (req, res)=>{
    moviesCollection.find({ type: req.query.type })
    .toArray((err, documents)=>{
      // console.log(err, documents)
      res.send(documents);
    })
  })

  // app.get('/allRecommends', (req, res) =>{
  //   moviesCollection.find({ type: "recommend"})
  //   .toArray((err, recommends)=>{
  //     res.send(recommends);
  //   })
  // });

  // app.get('/allTrending', (req, res) =>{
  //   moviesCollection.find({ type: "trending"})
  //   .toArray((err, trendings)=>{
  //     res.send(trendings);
  //   })
  // });

  // app.get('/allNew', (req, res) =>{
  //   moviesCollection.find({ type: "new"})
  //   .toArray((err, news)=>{
  //     res.send(news);
  //   })
  // });

  // app.get('/allOriginals', (req, res) =>{
  //   moviesCollection.find({ type: "original"})
  //   .toArray((err, originals)=>{
  //     res.send(originals);
  //   })
  // });

  app.get('/details/:_id', (req, res)=>{
    moviesCollection.find({_id: ObjectID(req.params._id)})
    .toArray((err, movies)=>{
      res.send(movies[0]);
    })
  })

});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});