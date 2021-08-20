const Pool = require('pg').Pool;
require('dotenv').config();

const POSTGRES_DB_LOGIN = {
  host: process.env.host,
  user: process.env.user,
  database: process.env.database,
  port: process.env.port
};

const pool = new Pool(POSTGRES_DB_LOGIN);

// QUESTIONS LIST - GET /qa/questions
const getQuestionsById = async (req, res) => {
  const { product_id, page = 1, count = 5 } = req.query;
  const interval = (count * page) - count;

  await pool.query(`
      SELECT
        q.id AS question_id,
        q.body AS question_body,
        q.date_written AS question_date,
        q.asker_name AS asker_name,
        q.helpful AS question_helpfulness,
        q.reported AS reported,
        COALESCE(
          JSON_OBJECT_AGG(
            a.id,
            JSON_BUILD_OBJECT(
              'id', a.id,
              'body', a.body,
              'date', a.date_written,
              'answerer_name', a.answerer_name,
              'helpfulness', a.helpful,
              'photos', ARRAY(
                SELECT photos.url
                FROM photos
                WHERE photos.answer_id = a.id
            )
          )
        )
        FILTER (
          WHERE
            a.id
          IS NOT NULL),
            '{}'::JSON)
          AS
            answers
      FROM
        questions q
      LEFT JOIN
        answers a
      ON
        q.id = a.question_id
      WHERE
        q.product_id = $1
      AND
        q.reported = 0
      GROUP BY
        q.id
      LIMIT
        $2
      OFFSET
        $3`, [product_id, count, interval])
    .then((results) => {
      if (!req.query.product_id) {
        res.status(422).end('Error: invalid product_id provided');
      } else {
        let resultObj = {
          product_id: req.query.product_id,
          results: results.rows
        }
        res.status(200).json(resultObj);
      }
    })
    .catch((err) => res.send('Error in request'))
}

// ANSWERS LIST - GET /qa/questions/:question_id/answers
const getAnswersById = async (req, res) => {
  const { question_id } = req.params;
  const { page = 1, count = 5 } = req.query;
  const interval = (count * page) - count;

  await pool.query(`
      SELECT
        a.id as id,
        a.body as body,
        a.date_written as date,
        a.answerer_name as answerer_name,
        a.helpful as helpfulness,
        COALESCE(
          ARRAY_AGG(
            JSON_BUILD_OBJECT(
              'id', photos.id,
              'url', photos.url
            )
          ) FILTER
          (
            WHERE
              photos.id
            IS NOT NULL),
        '{}')
        AS
          photos
      FROM
        answers a
      LEFT JOIN
        photos
      ON
        a.id = photos.answer_id
      WHERE
        a.question_id = $1
          AND
            a.reported = 0
      GROUP BY
        a.id
      LIMIT
        $2
      OFFSET
        $3`, [question_id, count, interval])
    .then((results) => {
      let resultObj = {
        question_id: req.params.question_id,
        results: results.rows
      };
      res.status(200).json(resultObj);
    })
    .catch(err => res.send(err))
}

// ADD A QUESTION = POST /qa/questions
const addAQuestion = async (req, res) => {
  const { body, name, email, product_id } = req.body;
  await pool.query(`
      INSERT INTO
        questions (body, product_id, asker_name, asker_email)
      VALUES
        ($1, $2, $3, $4)
      `, [body, product_id, name, email])
    .then(() => {
      res.send('Question added successfully')
    })
    .catch((err) => res.send(err))
}

// ADD AN ANSWER - POST /qa/questions/:question_id/answers
const addAnAnswer = async (req, res) => {
  const { body, name, email, photos } = req.body;
  const { question_id } = req.params;
  await pool.query(`
      WITH
        build
      AS
      (
      INSERT INTO
        answers (question_id, body, answerer_name, answerer_email)
      VALUES
        ($1, $2, $3, $4)
      RETURNING
        id
      )
      INSERT INTO
        photos (answer_id, url)
      SELECT
        id,
      UNNEST
        (($5)::text[])
      FROM
        build`, [question_id, body, name, email, photos])
    .then(() => {
      res.send('Answer added successfully')
    })
    .catch((err) => {
      res.send(err)
    })
}

// Mark Question as Helpful - PUT /qa/questions/:question_id/helpful
const markQuestionHelpful = async (req, res) => {
  const { question_id } = req.params;
  await pool.query(`
      UPDATE
        questions
      SET
        helpful = helpful + 1
      WHERE
        id = $1`, [question_id])
    .then(() => {
      res.send('Successful mark helpful')
    })
    .catch((err) => res.send(err))
}

// Report Question - PUT /qa/questions/:question_id/report
const reportQuestion = async (req, res) => {
  const { question_id } = req.params;
  await pool.query(`
      UPDATE
        questions
      SET
        report = report + 1
      WHERE
        id = $1`, [question_id])
    .then(() => {
      res.send('Successful report')
    })
    .catch((err) => res.send(err))
}

// Mark Answer as Helpful - PUT /qa/answers/:answer_id/helpful
const markAnswerHelpful = async (req, res) => {
  const { answer_id } = req.params;
  await pool.query(`
      UPDATE
        answers
      SET
        helpful = helpful + 1
      WHERE
        id = $1`, [answer_id])
    .then(() => {
      res.send('Successful mark helpful')
    })
    .catch((err) => res.send(err))
}

// Report Answer - PUT /qa/answers/:answer_id/report
const reportAnswer = async (req, res) => {
  const { answer_id } = req.params;
  await pool.query(`
      UPDATE
        answers
      SET
        report = report + 1
      WHERE
        id = $1`, [answer_id])
    .then(() => {
      res.send('Successful report')
    })
    .catch((err) => res.send(err))
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