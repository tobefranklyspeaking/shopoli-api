const express = require('express');
const bodyParser = require('body-parser');
const db = require('./routes.js');
const app = express();

const PORT = 8080;
const HOST = '0.0.0.0';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/*********************************/
app.get('/', (req, res) => {
  res.send('This is working');
})
/*********************************/


app.get('/qa/questions/', db.getQuestionsById);
app.get('/qa/questions/:question_id/answers', db.getAnswersById);


app.post('/qa/questions', db.addAQuestion);
app.post('/qa/questions/:question_id/answers', db.addAnAnswer);


app.put('/qa/questions/:question_id/helpful', db.markQuestionHelpful);
app.put('/qa/questions/:question_id/report', db.reportQuestion);
app.put('/qa/answers/:answer_id/helpful', db.markAnswerHelpful);
app.put('/qa/answers/:answer_id/report', db.reportAnswer);


// app.listen(3000);

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);