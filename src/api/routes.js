const Pool = require('pg').Pool;
const POSTGRES_DB_LOGIN = require('/Users/franklyspeaking/HackReactor/sprints/ecommerce-api/config.js');
const pool = new Pool(POSTGRES_DB_LOGIN);

// GET /qa/questions
const getAllQuestions = (req, res) => {
  // let page = req.body.page ? parseInt(req.body.page) : 1;
  // let sort = req.body.sort ? req.body.sort : question_id;
  // let count = req.body.count ? parseInt(req.body.count) : 5;
  pool.query('SELECT * FROM questions ORDER BY helpful ASC LIMIT 5', (err, res) => {
    if (err) {
      console.log('err on get questions', err);
      return;
    }
    console.log('pending');
    res.status(200).json(res.body)
  })
}

// // GET /qa/questions/:question_id/answers
// const getQuestionsById = (req, res) => {
//   const product_id = parseInt(req.params.product_id);
//   pool.query('SELECT * FROM questions where product_id = $1', [id], (err, res) => {
//     if (err) {
//       throw err;
//     }
//     response.status(200).json(res.body)
//   })
// }

// const getQuestions = (req, res) => {
//   pool.query('SELECT * FROM questions ORDER BY id ASC limit 5', (err, res) => {
//     if (err) {
//       throw err;
//     }
//     response.status(200).json(res.rows)
//   })
// }

// const getQuestions = (req, res) => {
//   pool.query('SELECT * FROM questions ORDER BY id ASC limit 5', (err, res) => {
//     if (err) {
//       throw err;
//     }
//     response.status(200).json(res.rows)
//   })
// }

// const getQuestions = (req, res) => {
//   pool.query('SELECT * FROM questions ORDER BY id ASC limit 5', (err, res) => {
//     if (err) {
//       throw err;
//     }
//     response.status(200).json(res.rows)
//   })
// }

// const getQuestions = (req, res) => {
//   pool.query('SELECT * FROM questions ORDER BY id ASC limit 5', (err, res) => {
//     if (err) {
//       throw err;
//     }
//     response.status(200).json(res.rows)
//   })
// }

module.exports = {
  getAllQuestions
}