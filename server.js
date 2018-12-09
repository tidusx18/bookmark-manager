let express = require('express');
let mongoose = require('mongoose');
let path = require('path');
let app = express();
let cors = require('cors')
let port = 3005;
const bodyParser = require('body-parser');
let bookmark = require('./routes/bookmark.js');
let tag = require('./routes/tag.js');

// connect to DB
let mongoDB = 'mongodb://tidusx18:Gotenks%40518@ds119853.mlab.com:19853/bookmark_manager';
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
let db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, 'client/build')));

app.use('/bookmarks', bookmark);
app.use('/tags', tag);


app.listen(port, () => console.log(`\n\r\n\rExample app listening on port ${port}!`));
