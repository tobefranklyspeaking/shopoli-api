const express = require('express');
const bodyParser = require('body-parser');
const db = require('./routes.js');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/qa/questions/', db.getQuestionsById);
app.get('/qa/questions/:question_id/answers', db.getAnswersById);


app.post('/qa/questions', db.addAQuestion);
app.post('/qa/questions/:question_id/answers', db.addAnAnswer);


app.put('qa/questions/:question_id/helpful', db.markQuestionHelpful);
app.put('qa/questions/:question_id/report', db.reportQuestion);
app.put('qa/questions/:answer_id/helpful', db.markAnswerHelpful);
app.put('qa/questions/:answer_id/report', db.reportAnswer);


app.listen(3000);