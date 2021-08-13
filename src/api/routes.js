const Pool = require('pg').Pool;
const POSTGRES_DB_LOGIN = require('/Users/franklyspeaking/HackReactor/sprints/ecommerce-api/config.js');

const pool = new Pool(POSTGRES_DB_LOGIN);

// QUESTIONS LIST - GET /qa/questions
const getAllQuestions = async (req, response) => {
  const { page, count=5 } = parseInt(req.body);
  const client = await pool.connect();

  await pool.query('SELECT * FROM questions ORDER BY id ASC LIMIT $1', [count], (err, results) => {
    if (err) {
      console.log('err on get questions', err);
      return;
    }
    console.log('success', results.rows);
    response.status(200).json(results.rows)
    client.release();
  })
}

// ANSWERS LIST - GET /qa/questions/:question_id/answers
const getQuestionsById = (req, response) => {
  const { product_id } = parseInt(req.params);

  console.log(product_id);
  pool.query('SELECT * FROM answers WHERE product_id = $1', [product_id], (err, results) => {
    if (err) {
      throw err;
    }
    response.status(200).json(res.rows)
  })
}

// const addAQuestion = (req, response) => {
//   const product_id = parseInt(req.params.product_id);
//   console.log(product_id);
//   pool.query('SELECT * FROM questions where product_id = $1', [product_id], (err, results) => {
//     if (err) {
//       throw err;
//     }
//     response.status(200).json(res.rows)
//   })
// }

module.exports = {
  getAllQuestions,
  getQuestionsById
}