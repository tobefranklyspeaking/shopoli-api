
CREATE DATABASE qaapi;

\connect qaapi;


/******** CREATE QUESTIONS ********/

CREATE TABLE IF NOT EXISTS questions (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL,
  body TEXT NOT NULL,
  date_written BIGINT NOT NULL,
  asker_name TEXT NOT NULL,
  asker_email TEXT NOT NULL,
  reported INTEGER NOT NULL DEFAULT 0,
  helpful INTEGER NOT NULL DEFAULT 0
);

COPY questions FROM '/Users/franklyspeaking/Desktop/questions.csv' WITH DELIMITER ',' CSV HEADER;

alter table questions
alter column date_written type timestamp without time zone using to_timestamp(date_written/1000),
ALTER COLUMN date_written SET DEFAULT current_timestamp;

SELECT setval('questions_id_seq',(SELECT GREATEST(MAX(id)+1,nextval('questions_id_seq')) - 1 FROM questions));


/*************** CREATE ANSWERS *****************/

CREATE TABLE IF NOT EXISTS answers (
  id SERIAL PRIMARY KEY,
  question_id INTEGER NOT NULL,
  body TEXT NOT NULL,
  date_written BIGINT NOT NULL,
  answerer_name TEXT NOT NULL,
  answerer_email TEXT NOT NULL,
  reported INTEGER NOT NULL DEFAULT 0,
  helpful INTEGER NOT NULL DEFAULT 0
);

COPY answers FROM '/Users/franklyspeaking/Desktop/answers.csv' WITH DELIMITER ',' CSV HEADER;

alter table answers
alter column date_written type timestamp without time zone using to_timestamp(date_written/1000),
ALTER COLUMN date_written SET DEFAULT current_timestamp;

SELECT setval('answers_id_seq',(SELECT GREATEST(MAX(id)+1,nextval('answers_id_seq')) - 1 FROM answers));


/***************CREATE PHOTOS*****************/

CREATE TABLE IF NOT EXISTS photos (
  id SERIAL PRIMARY KEY,
  answer_id integer NOT NULL,
  url VARCHAR(2083) NOT NULL
);

COPY photos FROM '/Users/franklyspeaking/Desktop/answers_photos.csv' WITH DELIMITER ',' CSV HEADER;

SELECT setval('photos_id_seq',(SELECT GREATEST(MAX(id)+1,nextval('photos_id_seq')) - 1 FROM photos));


/***************Data Load********************/

COPY answers FROM '/Users/franklyspeaking/Desktop/answers.csv' WITH DELIMITER ',' CSV HEADER;

COPY questions FROM '/Users/franklyspeaking/Desktop/questions.csv' WITH DELIMITER ',' CSV HEADER;

COPY photos FROM '/Users/franklyspeaking/Desktop/answers_photos.csv' WITH DELIMITER ',' CSV HEADER;

/******************* artillery.io *******************/
artillery quick --count 1 --num 1000 http://127.0.0.1:3000/qa/questions/2500001/answers

artillery quick --count 100 --num 1000 http://127.0.0.1:3000/qa/questions/?product_id=1000000&count=100

create index questions_products_seq on questions(product_id);
create index answers_question_seq on answers(question_id);
create index photos_answers_seq on photos(answer_id);

explain analyze select * from answers where question_id = 2500001;
gather
2 workers
 Planning Time: 0.047 ms
 Execution Time: 247.783 ms
 Planning Time: 0.046 ms
 Execution Time: 250.024 ms
  Planning Time: 0.048 ms
 Execution Time: 249.996 ms
  Planning Time: 0.052 ms
 Execution Time: 254.592 ms
----------------------------
after indexing
index scan
 Planning Time: 0.334 ms
 Execution Time: 0.035 ms
  Planning Time: 0.054 ms
 Execution Time: 0.025 ms
  Planning Time: 0.053 ms
 Execution Time: 0.024 ms
  Planning Time: 0.061 ms
 Execution Time: 0.021 ms



explain analyze select * from questions where product_id = 1000000;
Gather
2 workers
 Planning Time: 0.045 ms
 Execution Time: 122.348 ms
  Planning Time: 0.048 ms
 Execution Time: 120.952 ms
  Planning Time: 0.056 ms
 Execution Time: 121.716 ms
  Planning Time: 0.045 ms
 Execution Time: 124.064 ms
 ----------------------------
after indexing
index scan
 Planning Time: 0.052 ms
 Execution Time: 0.024 ms
  Planning Time: 0.053 ms
 Execution Time: 0.025 ms
  Planning Time: 0.044 ms
 Execution Time: 0.021 ms
  Planning Time: 0.055 ms
 Execution Time: 0.038 ms