const express = require('express');
const bodyParser = require('body-parser');
let methodOverride = require("method-override")
const app = express();

app.set('view engine', 'ejs'); // 템플릿 엔진 설정(필수)
app.set('views', __dirname + '/view'); // 템플릿 파일 위치 설정(필수)

app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride("_method"));

const movieRouter = require('./router/BookRouter');
app.use(movieRouter);

module.exports = app;
