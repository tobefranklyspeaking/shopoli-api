const Pool = require('pg').Pool;
const POSTGRES_DB_LOGIN = require('/Users/franklyspeaking/HackReactor/sprints/ecommerce-api/config.js');

const pool = new Pool(POSTGRES_DB_LOGIN);

// QUESTIONS LIST - GET /qa/questions
const getQuestionsById = async (req, response) => {
  const { product_id, page = 1, count = 5 } = req.query;
  const interval = (count * page) - count;

  let data = pool.query(`
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
        $3`,
    [product_id, count, interval],

    (err, results) => {
      if (err) { res.send('Error in request') }
      if (!req.query.product_id) {
        response.status(422).end('Error: invalid product_id provided');
      } else {
        let resultObj = {
          product_id: req.query.product_id,
          results: results.rows
        }
        response.status(200).json(resultObj);
      }
    }
  )
}

// ANSWERS LIST - GET /qa/questions/:question_id/answers
const getAnswersById = async (req, response) => {
  const { question_id } = req.params;
  const { page = 1, count = 5 } = req.query;
  const interval = (count * page) - count;

  pool.query(`
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
      $3`, [question_id, count, interval],
    (err, results) => {
      if (err) {
        response.send(err);
      }
      let resultObj = {
        question_id: req.params.question_id,
        results: results.rows
      }
      response.status(200).json(resultObj);
    }
  )
}

// ADD A QUESTION = POST /qa/questions
const addAQuestion = (req, response) => {
  const { body, name, email, product_id } = req.body;
  pool.connect()
  pool.query(`
    INSERT INTO
      questions
      (body, asker_name, asker_email, product_id)
    VALUES
      ($1,$2,$3,$4)`, [body, name, email, product_id])
  .then((err, result) => {
    response.status(201).send('Successful post');
  })
  .catch((err) => {
    response.send(err)
  })
}

// ADD AN ANSWER - POST /qa/questions/:question_id/answers
const addAnAnswer = async (req, response) => {
  const { body, name, email, photos } = req.body;
  const { question_id } = req.params;
  pool.query(`
    INSERT INTO
      answers
      (body, answerer_name, answerer_email, question_id)
    VALUES
      ($1,$2,$3,$4);
    INSERT INTO
      photos (answer_id, url)
    VALUES (
      SELECT
        id
      FROM
        answers
      WHERE
        question_id = $4)
      url = $5`, [body, name, email, question_id, photos],
    (err, result) => {
      if (err) {
        response.send(err);
      }
      response.send('Successful answer post')
    })
}

// Mark Question as Helpful - PUT /qa/questions/:question_id/helpful
const markQuestionHelpful = async (req, response) => {
  const { question_id } = req.params;
  pool.query(`
    UPDATE
      questions
    SET
      helpful = helpful + 1
    WHERE
      id = $1`, [question_id],
    (err, result) => {
      if (err) {
        response.send(err);
      }
      response.send('Successful help')
    })
}

// Report Question - PUT /qa/questions/:question_id/report
const reportQuestion = async (req, response) => {
  const { question_id } = req.params;
  pool.query(`
    UPDATE
      questions
    SET
      report = report + 1
    WHERE
      id = $1`, [question_id],
    (err, result) => {
      if (err) {
        response.send(err);
      }
      response.send('Successful report')
    })
}

// Mark Answer as Helpful - PUT /qa/answers/:answer_id/helpful
const markAnswerHelpful = async (req, response) => {
  const { answer_id } = req.params;
  pool.query(`
    UPDATE
      answers
    SET
      helpful = helpful + 1
    WHERE
      id = $1`, [answer_id],
    (err, result) => {
      if (err) {
        response.send(err);
      }
      response.send('Successful help')
    })
}

// Report Answer - PUT /qa/answers/:answer_id/report
const reportAnswer = async (req, response) => {
  const { answer_id } = req.params;
  pool.query(`
    UPDATE
      answers
    SET
      report = report + 1
    WHERE
      id = $1`, [answer_id],
    (err, result) => {
      if (err) {
        response.send(err);
      }
      response.send('Successful report')
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