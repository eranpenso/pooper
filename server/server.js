const express = require('express')
const { MongoClient } = require('mongodb');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 8080

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

const uri = process.env.CONNECTIONLINK;
const client = new MongoClient(process.env.CONNECTIONLINK || uri);

async function ConnectAndReturnCollection(client){
  try{
    await client.connect();
    return (await client.db("poop-db").collection("pins"));
  }catch(e){
    console.error(e);
    return;
  }
}

app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.get('/getpins', async (req, res) => {
  let collection = await ConnectAndReturnCollection(client);
  collection.find({}).toArray()
  .then(items =>{
    if(!items)
      res.send(null);
    else
      res.send(items);
  })
  
})

app.post('/addpin',async (req,res) =>{
  console.log(req.body)
  let collection = await ConnectAndReturnCollection(client);
  collection.insertOne(req.body, function (error, response) {
    if(error) {
        console.log('Error occurred while inserting');
        res.send(null)
    } else {
       res.send('ok')
    }
});
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
