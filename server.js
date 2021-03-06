require('dotenv').config();
let express = require('express');
let mongoose = require('mongoose');
let path = require('path');
let app = express();
let cors = require('cors')
let port = process.env.PORT || 3005;
const bodyParser = require('body-parser');
let bookmark = require('./routes/bookmark.js');
let tag = require('./routes/tag.js');

// connect to DB
let mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
let db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, 'client/build')));

app.use('/api/bookmarks', bookmark);
app.use('/api/tags', tag);
app.get('*', (req, res) => res.sendFile(path.resolve('client/build', 'index.html')));


app.listen(port, () => console.log(`\n\r\n\rExample app listening on port ${port}!`));