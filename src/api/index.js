const express = require('express');
const bodyParser = require('body-parser');
const db = require('./routes.js');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



// app.get('/qa/questions', async (req, res) => {
//   try {
//     res.json({ info: 'Node.js, Express, and Postgres API' })
//   } catch (err) {
//     res.send(err);
//   }
// });

app.get('/qa/questions', db.getAllQuestions);

app.listen(3000);

// app.get('/qa/questions', async (req, res) => {
//   try {
//     res.json({ info: 'Node.js, Express, and Postgres API' })
//   } catch (err) {
//     res.send(err);
//   }
//   //req.body requires product_id
//   //not req* page - default 1
//   //*count default 5
//   // res.send('Hello World');
// });

// app.get(`qa/questions/:question_id/answers`), async (req, res) => {
//   // req.params - question_id
//   // req.body - page / count same above
//   try {
//     res.send('Hello answers');
//   } catch (err) {
//     res.send(err);
//   }
// }

// app.post(`qa/questions`), (req, res) => {
//   // req.body
//   // body name email product_id
//   try {
//     res.send('Hello post questions');
//   } catch (err) {
//     res.send(err);
//   }
// }

// app.post(`qa/questions/:question_id/answers`), async (req, res) => {
//   // req.params
//   // question_id
//   // req.body
//   // body name email photos
//   try {
//     res.send('Hello post answers');
//   } catch (err) {
//     res.send(err);
//   }
// }

// app.put(`/qa/questions/:question_id/helpful`), async (req, res) => {
//   // req.body
//   // question_id
//   try {
//     res.send('Hello questions helpful');
//   } catch (err) {
//     res.send(err);
//   }
// }

// app.put(`/qa/questions/:question_id/report`), async (req, res) => {
//   // req.body
//   // question_id
//   try {
//     res.send('Hello questions report');
//   } catch (err) {
//     res.send(err);
//   }
// }

// app.put(`/qa/answers/:answer_id/helpful`), async (req, res) => {
//   // req.body
//   // answer_id
//   try {
//     res.send('Hello answers helpful');
//   } catch (err) {
//     res.send(err);
//   }
// }

// app.put(`/qa/answers/:answer_id/report`), async (req, res) => {
//   // req.body
//   // answer_id
//   try {
//     res.send('Hello answers report');
//   } catch (err) {
//     res.send(err);
//   }
// }