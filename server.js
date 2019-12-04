const express = require("express");
const bodyParser = require("body-parser");
const apiRoutes = require("./routes/api.js");
const app = express();
const PORT = 8080;
const helmet = require("helmet");
const cors = require('cors');
const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner');

const MongoClient = require("mongodb").MongoClient;
const URL = process.env.DB;
const dbName = "fcc_jtodd";
const client = new MongoClient(URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

const styleSources = [
  "'unsafe-inline'",
  "https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.min.css",
  "https://fonts.googleapis.com/"
];

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      styleSrc: [...styleSources],
      scriptSrc: ["'self'"]
    }
  })
);
app.use(cors({origin: '*'})); //For FCC testing purposes only
app.use(helmet.noCache());
app.use(helmet.hidePoweredBy({ setTo: "PHP 4.2.0" }));
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

client.connect(err => {
  if (err) console.log("Db connection error");
  
  fccTestingRoutes(app);
  apiRoutes(app, client.db(dbName));
  
  app.listen(PORT, () => {
    console.log("Server up @ ", PORT);
    
    if (process.env.NODE_ENV === 'test') {
      console.log('Running tests...');
      
      setTimeout(() => {
        try {
          runner.run();
        } catch(err) {
          console.log('Tests are not valid:');
          console.log(err);
        }
      }, 3500);
    }
  });
});

module.exports = app; //for testing