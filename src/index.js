const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const database = require('./config/db')
const routes = require('./api/routes');

app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use('/api/', routes)


mongoose.connect(database.url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
})
mongoose.connection.on('error', (err) => {
  console.log(`error ${err}`)
})

mongoose.connection.on('connected', () => {
  console.log('БД подключен...')
})


const port = process.env.PORT || 4040;
app.listen(port, () => {
  console.log('Сервер запущен...')
})