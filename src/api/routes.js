const Pool = require('pg').Pool;
const POSTGRES_DB_LOGIN = require('/Users/franklyspeaking/HackReactor/sprints/ecommerce-api/config.js');

const pool = new Pool(POSTGRES_DB_LOGIN);

const getAllData = async (req, res) => {


}

// QUESTIONS LIST - GET /qa/questions
const getQuestionsById = async (req, response) => {
  const client = await pool.connect();
  const { product_id, page = 1, count = 5 } = req.query;

  let data = pool.query(
    `SELECT
    q.product_id as product_id,
    JSON_BUILD_OBJECT(
      'question_id', q.id,
      'question_body', q.body,
      'question_date', q.date_written,
      'asker_name',  q.asker_name,
      'question_helpfuless', q.helpful,
      'reported', q.reported,
      'answers', JSON_BUILD_OBJECT (
        a.id, JSON_BUILD_OBJECT (
          'id', a.id,
          'body', a.body,
          'date', a.date_written,
          'answerer_name', a.answerer_name,
          'helpfulness', a.helpful,
          'photos', JSON_AGG(p.url)
        )
      )
    ) as results
  FROM
    questions q
  LEFT JOIN
    answers a
  ON
    q.id = a.question_id
  LEFT JOIN
    photos p
  ON
    a.id = p.answer_id
  WHERE
    q.product_id = $1
  GROUP BY
    q.product_id, q.id, a.id
  LIMIT
    $2`,
    [product_id, count], (err, results) => {
      if (err) { return; }
      response.status(200).json(results.rows);
      client.release();
    }
  )
}

// ANSWERS LIST - GET /qa/questions/:question_id/answers
const getAnswersById = async (req, response) => {
  const client = await pool.connect();
  const { question_id } = req.params;
  pool.query(`SELECT * FROM answers WHERE question_id = $1`, [question_id], (err, result) => {
    if (err) {
      throw err;
    }
    response.status(200).json(result.rows)
    client.release();
  })
}

// ADD A QUESTION = POST /qa/questions
const addAQuestion = async (req, response) => {
  const client = await pool.connect();
  const { body, name, email, product_id } = req.body;
  pool.query('INSERT INTO questions (body, asker_name, asker_email, product_id) VALUES ($1,$2,$3,$4)', [body, name, email, product_id], (err, result) => {
    if (err) {
      throw err;
    }
    response.status(200).json(result.rows)
    client.release();
  })
}

// ADD AN ANSWER - POST /qa/questions/:question_id/answers
const addAnAnswer = async (req, response) => {
  const client = await pool.connect();
  const { body, name, email, photos } = req.body;
  const { question_id } = req.params;
  pool.query(
    'INSERT INTO answers (body, answerer_name, answerer_email, question_id) VALUES ($1,$2,$3,$4); INSERT INTO photos (answer_id, url) VALUES (SELECT id FROM answers where question_id = $4) url = $5', [body, name, email, question_id, photos], (err, result) => {
      if (err) {
        throw err;
      }
      response.status(200).json(result.rows)
      client.release();
    })
}

// Mark Question as Helpful - PUT /qa/questions/:question_id/helpful
const markQuestionHelpful = async (req, response) => {
  const client = await pool.connect();
  const { question_id } = req.params;
  pool.query(
    'UPDATE questions SET helpful = helpful + 1 WHERE id = $1', [question_id], (err, result) => {
      if (err) {
        throw err;
      }
      response.status(200).json(result.rows)
      client.release();
    })
}
// Report Question - PUT /qa/questions/:question_id/report
const reportQuestion = async (req, response) => {
  const client = await pool.connect();
  const { question_id } = req.params;
  pool.query(
    'UPDATE questions SET report = report + 1 WHERE id = $1', [question_id], (err, result) => {
      if (err) {
        throw err;
      }
      response.status(200).json(result.rows)
      client.release();
    })
}
// Mark Answer as Helpful - PUT /qa/answers/:answer_id/helpful
const markAnswerHelpful = async (req, response) => {
  const client = await pool.connect();
  const { question_id } = req.params;
  pool.query(
    'UPDATE answers SET helpful = helpful + 1 WHERE id = $1', [question_id], (err, result) => {
      if (err) {
        throw err;
      }
      response.status(200).json(result.rows)
      client.release();
    })
}
// Report Answer - PUT /qa/answers/:answer_id/report
const reportAnswer = async (req, response) => {
  const client = await pool.connect();
  const { question_id } = req.params;
  pool.query(
    'UPDATE answers SET report = report + 1 WHERE id = $1', [question_id], (err, result) => {
      if (err) {
        throw err;
      }
      response.status(200).json(result.rows)
      client.release();
    })
}

module.exports = {
  getQuestionsById,
  getAnswersById,
  addAQuestion,
  addAnAnswer,
  markQuestionHelpful,
  reportQuestion,
  markAnswerHelpful,
  reportAnswer
}