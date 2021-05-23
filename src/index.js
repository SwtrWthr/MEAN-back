const express = require('express');
const path = require('path');
const cors = require("cors");
const routes = require('./api/routes');
const { connect } = require('./connection/db')

app = express();
app.use(cors({origin: '*'}));
app.options('*', cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use('/api/', routes)

//CONNECT MONGO
connect()

const port = process.env.PORT || 4040;
app.listen(port, '192.168.1.8', () => {
  console.log('Сервер запущен...')
})