
CREATE DATABASE qaapi;

\connect qaapi;

CREATE TABLE IF NOT EXISTS questions (
  question_id SERIAL PRIMARY KEY NOT NULL,
  product_id INTEGER NOT NULL,
  body TEXT NOT NULL,
  date_written BIGINT NOT NULL,
  asker_name TEXT NOT NULL,
  asker_email TEXT NOT NULL,
  reported INTEGER NOT NULL,
  helpful INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS answers (
  answer_id SERIAL NOT NULL PRIMARY KEY,
  question_id INTEGER NOT NULL,
  body TEXT NOT NULL,
  date_written BIGINT NOT NULL,
  answerer_name TEXT NOT NULL,
  answerer_email TEXT NOT NULL,
  reported INTEGER NOT NULL,
  helpful INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS photos (
  photo_id SERIAL NOT NULL PRIMARY KEY,
  answer_id integer NOT NULL,
  url VARCHAR(2083) NOT NULL
);

/***************Data Load********************/


COPY answers FROM '/Users/franklyspeaking/Desktop/answers.csv' WITH DELIMITER ',' CSV HEADER;

COPY questions FROM '/Users/franklyspeaking/Desktop/questions.csv' WITH DELIMITER ',' CSV HEADER;

COPY photos FROM '/Users/franklyspeaking/Desktop/answers_photos.csv' WITH DELIMITER ',' CSV HEADER;

/********works********/
alter table answers
alter date_written type varchar;

alter table answers
alter date_written type bigint using date_written::bigint;

alter table answers
alter date_written type varchar using date_written::to_char(varchar2, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"');

/*******converts unix-timestamp into js equivalent datetime not required*******/

-- select to_timestamp(date_written/1000) from answers limit 1;

-- select to_char(to_timestamp(date_written/1000), 'YYYY-MM-DD"T"HH24:MI:SS.MSZ') from answers limit 1;

ALTER TABLE answers
ALTER COLUMN date_written SET DATA TYPE timestamp without time zone USING to_timestamp(date_written/1000),
ALTER COLUMN date_written SET DEFAULT current_timestamp;

ALTER TABLE questions
ALTER COLUMN reported SET DEFAULT 0;
-- alter date_written type varchar using to_char(to_timestamp(date_written/1000), 'YYYY-MM-DD"T"HH24:MI:SS.MSZ');

/*****************************nested json response******************/

SELECT * FROM questions AS LEVEL
  WHERE product_id = $1
  ORDER BY id ASC LIMIT $2

  UNION ALL

  JOIN answers ON questions

  Select * FROM answers where question_id IN (select id from questions where product_id = 50)
          UNION
            SELECT * FROM photos WHERE answer_id in (SELECT id FROM answers where question_id in (select id from questions where product_id = 50))



jsonb_build_object
array_agg
leftjoin

{
    "product_id": "37311",
    "results": [
        {
            "question_id":,
            "question_body":,
            "question_date":,
            "asker_name":,
            "question_helpfulness":,
            "reported":
            "answers": [
                "https://images.unsplash.com/photo-1470116892389-0de5d9770b2c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1567&q=80",
                "https://images.unsplash.com/photo-1536922645426-5d658ab49b81?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80"

WITH [var] AS (SELECT * FROM questions WHERE product_id = ${product_id}),
  WITH [var2] AS (SELECT * FROM answers WHERE question_id = var.id),

json.agg()

SELECT
  p.*,
  row_to_json(e.*) as employee
FROM project p
INNER JOIN employee e USING(employee_id)


SELECT q.${product_id}, row_to_json(a.*) as answers FROM questions q
INNER JOIN answers a USING(question_id);



SELECT q.*, row_to_json(a.*) as answers FROM questions q
INNER JOIN answers question_id USING(id);

left join answers
on answers.id = answer_photos.answer_id
left joint answers_photos
on answers.id = photos.answer_id

`
  SELECT questions.id AS question_id, questions.question_body, questions.question_date, questions.asker_name, questions.question_helpfulness, questions.reported,
  JSONB_BUILD_OBJECT(‘hello’,
    JSONB_BUILD_OBJECT(‘id’, answers.id, ‘body’, answers.body, ‘date’, answers.date_written, ‘answerer_name’, answers.answerer_name,‘helpfulness’, answers.helpfulness, ‘photos’,
      ARRAY_AGG(answers_photos.url))) AS answers
  FROM questions
  LEFT JOIN answers
  ON questions.id = answers.question_id
  LEFT JOIN answers_photos
  ON answers.id = answers_photos.answer_id
  WHERE questions.product_id = ${req.query.product_id} AND questions.reported = false
  GROUP BY questions.id, answers.id
  LIMIT 10`

  -- QUESTIONS
  -- used below

  -- ANSWERS
  -- answers.question_id NOT NEEDED
  -- answers.answerer_email NOT NEEDED
  -- answers.reported NOT NEEDED

  -- PHOTOS
  -- photos.id
  -- photos.answer_id
  -- photos.url

select *
from questions
left join answers on questions.id = answers.question_id where questions.product_id = $1 limit $2

  questions.product_id as product_id
  "results": [
      {
          q.id as question_id,
          q.body as question_body,
          q.date_written as question_date,
          q.asker_name as asker_name,
          q.asker_email as asker_email,
          q.helpful as question_helpfulness,
          q.reported as reported,
          answers: {
              "answers.id actual number": {
                  a.id as id,
                  a.body as body,
                  a.date_written as date,
                  a.answerer_name as answerer_name,
                  a.helpful as helpfulness,
                  "photos": [
                      photos.url w/ no name
                  ]
              }
          }
      }
  ]

select
  q.*
  row_to_json(a.*) as answers
from questions q
inner join answers a
where
  questions.product_id = 20;

SELECT
  q.*,
  row_to_json(a.*) as answers
FROM questions q
INNER JOIN answers a USING(id) limit 5;

/******WORKS******/

SELECT
  q.*,
  row_to_json(a.*) as answers
FROM
  questions q
INNER JOIN
  answers a
ON
  q.id = a.question_id
WHERE
  q.product_id = 307
LIMIT
  5;

/****** Trying to get only data required ******/

WITH
  quest
AS
(
  SELECT
    q.id as question_id,
    q.body as question_body,
    q.date_written as question_date,
    q.asker_name as asker_name,
    q.helpful as question_helpfulness,
    q.reported as reported,
  FROM
    questions q
)

WITH
  ans
AS
(
  SELECT
    a.id as id,
    a.body as body,
    a.date_written as date,
    a.answerer_name as answerer_name,
    a.helpful as helpfulness,
  FROM
    answers a
)

ARRAY_AGG (
  photos.url
)

SELECT
  q.product_id as product_id,
  json_build_object(
      "question_id", q.id,

      )
  ) as results
FROM
  questions q
INNER JOIN
  answers a
ON
  q.id = a.question_id
INNER JOIN
  photos p
ON
  a.id = p.answer_id
WHERE
  q.product_id = 307;







SELECT
  q.id as question_id,
  q.body as question_body,
  q.date_written as question_date,
  q.asker_name as asker_name,
  q.asker_email as asker_email,
  q.helpful as question_helpfulness,
  q.reported as reported,
  row_to_json(a.*) as answers
FROM
  questions q
INNER JOIN
  answers a
ON
  q.id = a.question_id
WHERE
  q.product_id = 307;
LIMIT
  5;

  row_to_json(quest) as results,
  row_to_json(ans) as answers,
  ARRAY_AGG(p.url) as photos

  groupby question_id

  index columns